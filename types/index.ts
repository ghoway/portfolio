export type ProjectCategory = "AI" | "Web" | "Networking";
export type PostStatus = "DRAFT" | "PUBLISHED";

export interface HeroData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  showHireMe: boolean;
  profileImageUrl: string | null;
  resumeUrl: string | null;
}

export interface AboutData {
  id: string;
  biography: string;
  careerGoals: string;
  cvLink: string | null;
  imageUrl: string | null;
}

export interface ExperienceData {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  order: number;
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  techStack: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  status: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImageUrl: string | null;
  status: string;
  tags: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface SiteSettingsMap {
  site_title: string;
  meta_description: string;
  meta_keywords: string;
  site_author: string;
  og_image_url: string;
  footer_text: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  default_theme: string;
  ai_model: string;
  contact_email: string;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  smtp_to: string;
  [key: string]: string;
}
