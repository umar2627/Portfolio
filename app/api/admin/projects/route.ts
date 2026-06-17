import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const supabase = createServiceClient();

  const { data: maxOrder } = await supabase
    .from("projects")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const { data, error: dbError } = await supabase
    .from("projects")
    .insert({ ...body, order_index: (maxOrder?.order_index ?? -1) + 1 })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { items } = await request.json();
  const supabase = createServiceClient();

  for (const item of items) {
    await supabase
      .from("projects")
      .update({ order_index: item.order_index })
      .eq("id", item.id);
  }

  return NextResponse.json({ success: true });
}
