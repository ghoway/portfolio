import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { CertificationsSection } from "@/components/sections/certifications";
import { ContactSection } from "@/components/sections/contact";
import { getHero } from "@/actions/hero";
import { getAbout } from "@/actions/about";
import { getExperiences } from "@/actions/experience";
import { getSkills } from "@/actions/skills";
import { getProjects } from "@/actions/projects";
import { getSiteSettings } from "@/actions/settings";

export default async function Home() {
  const [hero, about, experiences, skills, projects, settings] = await Promise.all([
    getHero(),
    getAbout(),
    getExperiences(),
    getSkills(),
    getProjects({ status: "PUBLISHED" }),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar name={hero?.name} />
      <main className="min-h-screen">
        <HeroSection data={hero} />
        <AboutSection data={about} />
        <ExperienceSection data={experiences} />
        <SkillsSection data={skills} />
        <CertificationsSection />
        <ProjectsSection data={projects} />
        <ContactSection email={settings.contact_email} />
      </main>
      <Footer />
    </>
  );
}
