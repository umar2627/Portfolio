import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  getEducation,
  getExperience,
  getProjects,
  getApprovedReviews,
  getSiteSetting,
} from "@/lib/data";

export const revalidate = 3600;

const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About }))
);
const Education = dynamic(() =>
  import("@/components/sections/Education").then((m) => ({ default: m.Education }))
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => ({ default: m.Experience }))
);
const ProjectsShowcase = dynamic(() =>
  import("@/components/sections/ProjectsShowcase").then((m) => ({
    default: m.ProjectsShowcase,
  }))
);
const Reviews = dynamic(() =>
  import("@/components/sections/Reviews").then((m) => ({ default: m.Reviews }))
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact }))
);

export default async function HomePage() {
  const [education, experience, projects, reviewsData, bio, profileImage, name, title] =
    await Promise.all([
      getEducation(),
      getExperience(),
      getProjects(),
      getApprovedReviews(),
      getSiteSetting("bio"),
      getSiteSetting("profile_image"),
      getSiteSetting("name"),
      getSiteSetting("title"),
    ]);

  return (
    <>
      <Hero />

      <AnimatedSection id="about">
        <SectionHeader
          number="01"
          label="ABOUT"
          title="About Me"
          description="Get to know me better — my background, skills, and what drives me."
        />
        <div className="mt-12">
          <About
            bio={bio ?? undefined}
            profileImage={profileImage ?? undefined}
            name={name ?? undefined}
            title={title ?? undefined}
          />
        </div>
      </AnimatedSection>

      <AnimatedSection id="education">
        <SectionHeader
          number="02"
          label="EDUCATION"
          title="My Education"
          gradientWord="Education"
          description="Academic background and qualifications."
        />
        <div className="mt-12">
          <Education education={education} />
        </div>
      </AnimatedSection>

      <AnimatedSection id="experience">
        <SectionHeader
          number="02"
          label="EXPERIENCE"
          title="Where I've worked."
          gradientWord="worked."
          description="My professional journey and the roles I've held."
        />
        <div className="mt-12">
          <Experience experience={experience} />
        </div>
      </AnimatedSection>

      <AnimatedSection id="projects">
        <ProjectsShowcase projects={projects} />
      </AnimatedSection>

      <AnimatedSection id="reviews">
        <SectionHeader
          number="05"
          label="REVIEWS"
          title="What people say."
          gradientWord="say."
          description="Testimonials from clients and colleagues."
        />
        <div className="mt-12">
          <Reviews
            reviews={reviewsData.reviews}
            averageRating={reviewsData.averageRating}
            totalCount={reviewsData.totalCount}
          />
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact">
        <SectionHeader
          number="04"
          label="CONTACT"
          title="Let's connect."
          gradientWord="connect."
          description="Have a project in mind? I'd love to hear from you."
        />
        <div className="mt-12">
          <Contact />
        </div>
      </AnimatedSection>
    </>
  );
}
