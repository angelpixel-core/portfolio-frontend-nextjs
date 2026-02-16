/**
 * @deprecated Since 2026-02-16 (Story 23.2). This barrel file is deprecated.
 *
 * Use direct path imports instead:
 * ```typescript
 * // DON'T: import { ArrowButton } from "@/atoms";
 * // DO: import ArrowButton from "@/atoms/buttons/ArrowButton";
 * ```
 *
 * ESLint `no-barrel-imports-in-ui` blocks barrel imports in src/ui/ and src/app/.
 * See: docs/architecture/import-rules.md
 */

/* Buttons (11) */
export { default as ArrowButton } from "./buttons/ArrowButton";
export { default as AuthButton } from "./buttons/AuthButton";
export { default as ChatButton } from "./buttons/ChatButton";
export { default as NavigationItemButton } from "./buttons/NavigationItemButton";
export { default as HireMeButton } from "./buttons/HireMeButton";
export { default as HireMeHeaderButton } from "./buttons/HireMeHeaderButton";
export { default as MenuButton } from "./buttons/MenuButton";
export { default as NeumorphicToggle } from "./buttons/NeumorphicToggle";
export { default as SkillSelectorButton } from "./buttons/SkillSelectorButton";
export { default as ThemeButton } from "./buttons/ThemeButton";
export { default as CopyButton } from "./buttons/CopyButton";

/* HOCs (4) */
export { FramerImage } from "./hocs/FramerImage";
export { default as History } from "./hocs/History";
export { MainContainer } from "./hocs/MainContainer";
export { default as TransitionerLi } from "./hocs/TransitionerLi";

/* Links (6) */
export { default as BaseLink } from "./links/BaseLink";
export { default as CalendarLink } from "./links/CalendarLink";
export { default as NavigationItemLink } from "./links/NavigationItemLink";
export { default as ImageLink } from "./links/ImageLink";
export { default as TransitionLink } from "./links/TransitionLink";
export { default as WhatsAppLink } from "./links/WhatsAppLink";

/* Motion (1) */
export { default as ArticleAppearance } from "./motion/ArticleAppearance";

/* Shadows (2) */
export { BoxShadow } from "./shadows/BoxShadow";
export { FeaturedBoxShadow } from "./shadows/FeaturedBoxShadow";

/* Texts (5) */
export { default as ActiveMark } from "./texts/ActiveMark";
export { default as AnimatedNumber } from "./texts/AnimatedNumber";
export { default as AnimatedTitle } from "./texts/AnimatedTitle";
export { default as CircularText } from "./texts/CircularText";
export { default as ParagraphText } from "./texts/ParagraphText";

/* Standalone */
export { ArticleHoverThumbnail } from "./ArticleHoverThumbnail";
