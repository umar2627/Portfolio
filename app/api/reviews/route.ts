import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations/review";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const reviews = data ?? [];
    const totalCount = reviews.length;
    const averageRating =
      totalCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
        : 0;

    return NextResponse.json({ reviews, averageRating, totalCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { name, role, company, rating, review_text } = parsed.data;

    const { error } = await supabase.from("reviews").insert({
      name,
      role: role?.trim() || null,
      company: company?.trim() || null,
      rating,
      review_text,
      is_approved: false,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
