const FALLBACK_RESUME = "/resume.pdf";

export async function openResume(fileName = "resume.pdf") {
  let url = FALLBACK_RESUME;

  try {
    const res = await fetch("/api/resume");
    if (res.ok) {
      const data = await res.json();
      if (data.url) url = data.url;
    }
  } catch {
    // use fallback
  }

  window.open(url, "_blank", "noopener,noreferrer");

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  if (url.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
