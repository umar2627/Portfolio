import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from("site_settings")
    .select("key, value");

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const supabase = createServiceClient();

  const allowedKeys = [
    "profile_image",
    "resume_url",
    "bio",
    "name",
    "title",
    "hero_stats_years",
    "hero_stats_projects",
  ];

  for (const [key, value] of Object.entries(body)) {
    if (!allowedKeys.includes(key) || typeof value !== "string") continue;

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .single();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  }

  return NextResponse.json({ success: true });
}
