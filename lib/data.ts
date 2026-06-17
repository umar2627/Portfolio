import { createClient } from "@/lib/supabase/server";
import type {
  Education,
  Experience,
  Project,
  Review,
} from "@/types";

export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getExperience(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getApprovedReviews(): Promise<{
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}> {
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
    return { reviews, averageRating, totalCount };
  } catch {
    return { reviews: [], averageRating: 0, totalCount: 0 };
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    if (error) return null;
    return data?.value ?? null;
  } catch {
    return null;
  }
}
