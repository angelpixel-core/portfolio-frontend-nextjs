/**
 * Hooks Barrel
 *
 * Central export point for all custom hooks.
 * Import hooks from '@/hooks' instead of individual paths.
 *
 * @example
 * import { useAppSelector, useAppDispatch, useProfile } from '@/hooks';
 */

// Store (2)
export { default as useAppDispatch } from "./store/AppDispatch";
export { default as useAppSelector } from "./store/AppSelector";

// UI (4)
export { useReducedMotion } from "./ui/useReducedMotion";
export { useScrollAppearance } from "./ui/useScrollAppearance";
export { useTouchState } from "./ui/useTouchState";
export { useTransition } from "./ui/useTransition";

// Domains (15)
export { useProfile, useProfiles } from "@/domains/profile/queries";
export { useContent, useContents } from "@/domains/content/queries";
export { useNavigationItems } from "@/domains/navigation-item/queries";
export { useTechnologies } from "@/domains/technology/queries";
export { useProjects } from "@/domains/project/queries";
export { useArticle, useArticles } from "@/domains/article/queries";
export { useJobExperiences } from "@/domains/job-experience/queries";
export { useAcademics } from "@/domains/academic/queries";
export { useExperienceStats } from "@/domains/experience-stat/queries";
export { useCustomer, useCustomers } from "@/domains/customer/queries";
export { useContactPoints } from "@/domains/contact-point/queries";

// Auth (3)
export { default as useAuth } from "./auth/useAuth";
export { default as useUser } from "./auth/useUser";
export { default as useIsAuthenticated } from "./auth/useIsAuthenticated";
