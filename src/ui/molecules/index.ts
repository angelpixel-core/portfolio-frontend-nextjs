/**
 * @deprecated Since 2026-02-16 (Story 23.2). This barrel file is deprecated.
 *
 * Use direct path imports instead:
 * ```typescript
 * // DON'T: import { Hero } from "@/molecules";
 * // DO: import Hero from "@/molecules/Hero";
 * ```
 *
 * ESLint `no-barrel-imports-in-ui` blocks barrel imports in src/ui/ and src/app/.
 * See: docs/architecture/import-rules.md
 */

/* HOME */
export { default as Hero } from "./Hero";
export { default as Title } from "./Title";
export { default as Paragraph } from "./Paragraph";
export { default as Resume } from "./Resume";
export { default as Calendar } from "./Calendar";
export { default as CustomersSlider } from "./CustomersSlider";
export { default as TechnologiesSlider } from "./TechnologiesSlider";
export { default as HireMe } from "./HireMe";

/* ABOUT */
export { default as ExtraInfo } from "./ExtraInfo";
export { default as Education } from "./Education";
export { default as Experience } from "./Experience";

/* PROJECTS */
export { default as TechnologyFilter } from "./TechnologyFilter";

/* ARTICLES */
export { default as ArticleListItem } from "./ArticleListItem";
export { default as SocialShareButtons } from "./SocialShareButtons";
export { default as FeaturedArticlesCarousel } from "./FeaturedArticlesCarousel";

/* LAYOUT */
export { default as AnimatedChildren } from "./AnimatedChildren";
export { default as Logo } from "./Logo";
export { default as LogoMenuTrigger } from "./LogoMenuTrigger";
export { default as TransitionEffect } from "./TransitionEffect";

/* LAYOUT - Header */
export { default as SocialNetworkLink } from "./SocialNetworkLink";
export { default as SocialAuthDropdown } from "./SocialAuthDropdown";

/* LAYOUT - Footer */
export { default as Author } from "./Author";
export { default as CopyEmail } from "./CopyEmail";
export { default as Copyright } from "./Copyright";
export { default as Telegram } from "./Telegram";
// export { default as WhatsApp } from "./WhatsApp";
