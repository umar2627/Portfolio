export interface Education {
  id: string;
  degree: string;
  institution: string;
  institution_url: string | null;
  start_date: string;
  end_date: string | null;
  grade: string | null;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  company_url: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string[];
  tech_stack: string[];
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}

export type ProjectFilter = "all" | "featured" | "full-stack" | "open-source" | "backend";
