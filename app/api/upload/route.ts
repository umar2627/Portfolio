import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) ?? "image";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isResume = uploadType === "resume";
    const allowedTypes = isResume
      ? ["application/pdf"]
      : ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: isResume ? "Only PDF files allowed" : "Invalid file type" },
        { status: 400 }
      );
    }

    const maxSize = isResume ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${isResume ? "10MB" : "5MB"})` },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const bucket = process.env.SUPABASE_BUCKET_NAME ?? "portfolio-images";
    const folder = isResume ? "resumes" : "";
    const ext = file.name.split(".").pop();
    const fileName = folder
      ? `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      : `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
