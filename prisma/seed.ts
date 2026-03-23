import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD || "change-me-123";
const seedAdminName = process.env.SEED_ADMIN_NAME || "John Doe";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = hashSync(seedAdminPassword, 12);
  await prisma.user.upsert({
    where: { email: seedAdminEmail },
    update: {},
    create: {
      name: seedAdminName,
      email: seedAdminEmail,
      hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user seeded: ${seedAdminEmail}`);

  await prisma.heroSection.upsert({
    where: { id: "default-hero" },
    update: {},
    create: {
      id: "default-hero",
      name: "John Doe",
      subtitle: "Full Stack Developer",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Building reliable web products with modern tooling.",
      showHireMe: true,
    },
  });
  console.log("Hero section seeded");

  await prisma.aboutSection.upsert({
    where: { id: "default-about" },
    update: {},
    create: {
      id: "default-about",
      biography:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      careerGoals:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
  });
  console.log("About section seeded");

  const existingExp = await prisma.experience.findFirst();
  if (!existingExp) {
    await prisma.experience.create({
      data: {
        title: "Software Engineer",
        company: "Acme Corp",
        startDate: "2024-01",
        endDate: "2025-01",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Worked on APIs, frontend features, and internal tooling.",
        order: 1,
      },
    });
  }
  console.log("Experience seeded");

  const existingSkills = await prisma.skill.count();
  if (existingSkills === 0) {
    const skills = [
      { name: "JavaScript", category: "Programming", level: 80, icon: "code", order: 1 },
      { name: "TypeScript", category: "Programming", level: 75, icon: "code", order: 2 },
      { name: "React", category: "Frontend", level: 80, icon: "layout", order: 3 },
      { name: "Next.js", category: "Frontend", level: 75, icon: "layout", order: 4 },
      { name: "Node.js", category: "Backend", level: 75, icon: "server", order: 5 },
      { name: "Prisma", category: "Backend", level: 70, icon: "database", order: 6 },
      { name: "SQL", category: "Backend", level: 70, icon: "database", order: 7 },
      { name: "Tailwind CSS", category: "Frontend", level: 80, icon: "palette", order: 8 },
    ];

    for (const skill of skills) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log("Skills seeded");

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    const projects = [
      {
        title: "Project Alpha",
        slug: "project-alpha",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A sample project for demonstrating portfolio entries.",
        techStack: "Next.js,TypeScript,Prisma,PostgreSQL,Tailwind CSS",
        category: "Web",
        featured: true,
        status: "PUBLISHED",
        order: 1,
      },
      {
        title: "Project Beta",
        slug: "project-beta",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Includes API integration and dashboard components.",
        techStack: "React,Node.js,Express,PostgreSQL",
        category: "Backend",
        featured: false,
        status: "PUBLISHED",
        order: 2,
      },
      {
        title: "Project Gamma",
        slug: "project-gamma",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Focused on responsive UI and accessible interactions.",
        techStack: "Next.js,TypeScript,Tailwind CSS",
        category: "Frontend",
        featured: false,
        status: "DRAFT",
        order: 3,
      },
    ];

    for (const project of projects) {
      await prisma.project.create({ data: project });
    }
  }
  console.log("Projects seeded");

  const existingPosts = await prisma.blogPost.count();
  if (existingPosts === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          title: "Lorem Ipsum: Getting Started",
          slug: "lorem-ipsum-getting-started",
          content: `# Lorem Ipsum: Getting Started\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Overview\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Example\n\n\`\`\`ts\nexport function hello() {\n  return "Hello, world";\n}\n\`\`\`\n\n## Conclusion\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          seoTitle: "Lorem Ipsum Getting Started",
          seoDescription: "Sample seeded article for testing blog rendering.",
          status: "PUBLISHED",
          tags: "lorem,ipsum,sample",
          category: "General",
        },
        {
          title: "Dolor Sit Amet: Practical Notes",
          slug: "dolor-sit-amet-practical-notes",
          content: `# Dolor Sit Amet: Practical Notes\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n- Item one\n- Item two\n- Item three\n\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.`,
          excerpt: "Another seeded example post with placeholder content.",
          seoTitle: "Dolor Sit Amet Practical Notes",
          seoDescription: "Placeholder content for development and testing.",
          status: "PUBLISHED",
          tags: "sample,notes,placeholder",
          category: "General",
        },
      ],
    });
  }
  console.log("Blog posts seeded");

  const settings = [
    { key: "site_title", value: "John Doe Portfolio" },
    { key: "meta_description", value: "Open source portfolio starter with admin CMS." },
    { key: "footer_text", value: "Copyright 2026 John Doe. All rights reserved." },
    { key: "github_url", value: "https://github.com/johndoe" },
    { key: "linkedin_url", value: "https://linkedin.com/in/johndoe" },
    { key: "twitter_url", value: "https://x.com/johndoe" },
    { key: "instagram_url", value: "" },
    { key: "default_theme", value: "system" },
    { key: "contact_email", value: "hello@example.com" },
    { key: "ai_model", value: "z-ai/glm-4.5-air:free" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Site settings seeded");

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
