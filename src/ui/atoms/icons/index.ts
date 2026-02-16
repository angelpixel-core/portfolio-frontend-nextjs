/**
 * @deprecated This barrel file is deprecated and should not be used.
 *
 * **Why deprecated:**
 * - Barrel imports defeat tree-shaking, causing all 57 icons to be bundled even when only a few are used
 * - This results in ~50 KiB gzip of unused code in client bundles
 *
 * **Use direct imports instead:**
 * ```typescript
 * // ❌ DON'T: import { GitHubIcon } from "@/icons";
 * // ✅ DO: import GitHubIcon from "@/atoms/icons/GitHubIcon";
 * ```
 *
 * **ESLint protection:**
 * - The `no-barrel-imports-in-ui` rule blocks barrel imports in `src/ui/` and `src/app/`
 * - This file is kept for backward compatibility but has zero consumers
 *
 * **See:** `docs/architecture/import-rules.md` for detailed explanation
 * **Epic:** Epic 23 - Barrel File Cleanup (Story 23.1)
 */

/* Layout */
export { default as LogoIcon } from "./LogoIcon";

/* Socials */
export { default as CalendarIcon } from "./CalendarIcon";
export { default as CalendlyIcon } from "./CalendlyIcon";
export { default as DribbbleIcon } from "./DribbbleIcon";
export { default as GitHubIcon } from "./GitHubIcon";
export { default as GooglePlusIcon } from "./GooglePlusIcon";
export { default as LinkedInIcon } from "./LinkedInIcon";
export { default as MicrosoftIcon } from "./MicrosoftIcon";
export { default as PinterestIcon } from "./PinterestIcon";
export { default as TelegramIcon } from "./TelegramIcon";
export { default as TwitterIcon } from "./TwitterIcon";
export { default as WhatsAppIcon } from "./WhatsAppIcon";

/* Home */
export { default as CopyIcon } from "./CopyIcon";
export { default as CheckIcon } from "./CheckIcon";

/* Projects */
export { default as ArrowIcon } from "./ArrowIcon";

/* Experiences */
export { default as ChevronDownIcon } from "./ChevronDownIcon";
export { default as LiIcon } from "./LiIcon";

/* Theme */
export { default as MoonIcon } from "./MoonIcon";
export { default as SunIcon } from "./SunIcon";

/* Auth */
export { default as UserIcon } from "./UserIcon";
export { default as EnvelopeIcon } from "./EnvelopeIcon";

/* Technologies */
export { default as WWWIcon } from "./WWWIcon";

export { default as UnixIcon } from "./UnixIcon";
export { default as LinuxIcon } from "./LinuxIcon";
export { default as BashIcon } from "./BashIcon";
export { default as GitIcon } from "./GitIcon";
export { default as DockerIcon } from "./DockerIcon";
export { default as JenkinsIcon } from "./JenkinsIcon";
export { default as TerraformIcon } from "./TerraformIcon";
export { default as PulumiIcon } from "./PulumiIcon";
export { default as HerokuIcon } from "./HerokuIcon";
export { default as Icon } from "./AWSIcon";

export { default as RubyIcon } from "./RubyIcon";
export { default as RailsIcon } from "./RailsIcon";
export { default as RSpecIcon } from "./RSpecIcon";
export { default as CucumberIcon } from "./CucumberIcon";

export { default as PostgresIcon } from "./PostgresIcon";
export { default as MongoIcon } from "./MongoIcon";
export { default as RedisIcon } from "./RedisIcon";
export { default as GraphQLIcon } from "./GraphQLIcon";
export { default as KafkaIcon } from "./KafkaIcon";

export { default as HTML5Icon } from "./HTML5Icon";
export { default as FigmaIcon } from "./FigmaIcon";
export { default as StorybookIcon } from "./StorybookIcon";

export { default as CSS3Icon } from "./CSS3Icon";
export { default as SASSIcon } from "./SASSIcon";
export { default as TailwindIcon } from "./TailwindIcon";

export { default as JavaScriptIcon } from "./JavaScriptIcon";
export { default as NodeIcon } from "./NodeIcon";
export { default as ReactIcon } from "./ReactIcon";
export { default as ReduxIcon } from "./ReduxIcon";
export { default as SvelteIcon } from "./SvelteIcon";
export { default as NextIcon } from "./NextIcon";
export { default as TypeScriptIcon } from "./TypeScriptIcon";

export { default as RustIcon } from "./RustIcon";
export { default as SolidityIcon } from "./SolidityIcon";

export { default as QuestionIcon } from "./QuestionIcon";
