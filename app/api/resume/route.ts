import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/data";

export async function GET() {
  try {
    const resumeUrl = await getSiteSetting("resume_url");
    return NextResponse.json({
      url: resumeUrl || "/resume.pdf",
    });
  } catch {
    return NextResponse.json({ url: "/resume.pdf" });
  }
}
