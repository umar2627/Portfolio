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
    { label: "about", href: "#about", number: "01" },
    { label: "experience", href: "#experience", number: "02" },
    { label: "projects", href: "#projects", number: "03" },
    { label: "contact", href: "#contact", number: "04" },
  ],
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
    devops: ["Docker", "AWS", "CI/CD", "Kubernetes", "Terraform"],
  },
};
