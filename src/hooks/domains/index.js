/**
 * Domain Hooks
 *
 * Re-exports all React Query hooks from domains for easy access.
 * Components can import from '@/hooks' instead of individual domain paths.
 *
 * Usage:
 *   import { useProfile, useProjects, useArticles } from '@/hooks';
 */

// Profile
export { useProfile, useProfiles } from "@/domains/profile/queries";

// Content
export { useContent, useContents } from "@/domains/content/queries";

// Navigation
export { useNavigationItems } from "@/domains/navigation-item/queries";

// Technology
export { useTechnologies } from "@/domains/technology/queries";

// Project
export { useProjects } from "@/domains/project/queries";

// Article
export { useArticle, useArticles } from "@/domains/article/queries";

// Job Experience
export { useJobExperiences } from "@/domains/job-experience/queries";

// Academic
export { useAcademics } from "@/domains/academic/queries";

// Experience Stat
export { useExperienceStats } from "@/domains/experience-stat/queries";

// Customer
export { useCustomer, useCustomers } from "@/domains/customer/queries";

// Contact Point
export { useContactPoints } from "@/domains/contact-point/queries";
