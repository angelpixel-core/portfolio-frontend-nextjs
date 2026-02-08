// Layout - Home
export { default as Auth } from "./Auth";
export { default as Menu } from "./Menu";
export { default as MenuFloating } from "./MenuFloating";
export { default as MenuFloatingClient } from "./MenuFloatingClient";
export { default as MobileMenuOverlay } from "./MobileMenuOverlay";
export { default as NavBar } from "./NavBar";
export { default as Footer } from "./Footer";
export { default as Chat } from "./Chat";

// About
export { default as Biography } from "./Biography";
export { default as WordCloud } from "./WordCloud";
export { default as Experiences } from "./Experiences";
export { default as Academics } from "./Academics";
export { default as Hiring } from "./Hiring";

// Projects
export { default as ProjectDetail } from "./ProjectDetail";
export { default as ProjectDetailSkeleton } from "./ProjectDetail/skeleton";

// Articles
export { default as ArticleContent } from "./ArticleContent";
// ArticleCard: Multiple named exports by design - related card variants and utilities
export {
  ArticleCard,
  FeaturedArticleCard,
  GridArticleCard,
  ArticleMeta,
  ArticleLink,
} from "./ArticleCard";
