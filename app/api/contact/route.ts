import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/email";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const supabase = createServiceClient();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: rateData } = await supabase
      .from("contact_rate_limit")
      .select("*")
      .eq("ip", ip)
      .single();

    if (rateData) {
      const firstRequest = new Date(rateData.first_request);
      const isWithinHour = firstRequest > new Date(oneHourAgo);
      if (isWithinHour && rateData.request_count >= 3) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      if (isWithinHour) {
        await supabase
          .from("contact_rate_limit")
          .update({ request_count: rateData.request_count + 1 })
          .eq("ip", ip);
      } else {
        await supabase
          .from("contact_rate_limit")
          .update({ request_count: 1, first_request: new Date().toISOString() })
          .eq("ip", ip);
      }
    } else {
      await supabase.from("contact_rate_limit").insert({ ip, request_count: 1 });
    }

    const { name, email, subject, message } = parsed.data;

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject ?? null,
      message,
    });

    if (dbError) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    try {
      await sendContactEmail({ name, email, subject, message });
    } catch {
      // Message saved to DB even if email fails
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
