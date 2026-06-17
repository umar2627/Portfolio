export const siteConfig = {
  name: "Your Name",
  title: "Full Stack Developer",
  description:
    "Building scalable systems and beautiful interfaces. Passionate about clean code, performance, and user experience.",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "https://twitter.com",
  },
  nav: [
    { label: "about", href: "#about"},
    { label: "experience", href: "#experience"},
    { label: "projects", href: "#projects"},
    { label: "contact", href: "#contact"},
  ],
  skills: {
    frontend: ["SFCC B2C", "React", "Next.js", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "PostgreSQL", "Redis", "Supabase", "REST APIs"],
    devops: ["AWS", "CI/CD", "Vercel", "Git", "Jira"],
  },
};
