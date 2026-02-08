# UI Component Inventory

> Generated: 2026-01-15 | Architecture: Atomic Design

> **Update Needed (2026-02-08):** This inventory is outdated. Components added/removed in Epics 14-15 are not reflected. Key changes: `ProjectCard`, `ArticleCard`, `ArticleContent`, `Auth`, `AuthButton`, `NeumorphicToggle` added; `Project`, `FeaturedProject` removed. Full inventory refresh planned for future maintenance story.

## Overview

The UI follows **Atomic Design** methodology with 5 levels:
- **Atoms:** Basic building blocks (buttons, icons, links, texts)
- **Molecules:** Simple combinations of atoms
- **Organisms:** Complex, self-contained sections
- **Overlays:** Modal and floating components
- **Shared:** Reusable utilities (skeletons)

## Component Summary

| Level | Count | Description |
|-------|-------|-------------|
| Atoms | 77 | Basic elements |
| Molecules | 25 | Combined components |
| Organisms | 13 | Page sections |
| Overlays | 2 | Floating/modal |
| Shared | 1 | Utilities |
| **Total** | **118** | |

---

## Atoms (`src/ui/atoms/`)

### Buttons (8 components)

| Component | Path | Description |
|-----------|------|-------------|
| ArrowButton | `buttons/ArrowButton/` | Animated arrow button with skeleton |
| ChatButton | `buttons/ChatButton/` | Opens chat panel |
| CopyButton | `buttons/CopyButton/` | Copy to clipboard |
| HireMeButton | `buttons/HireMeButton/` | CTA for hiring |
| MenuButton | `buttons/MenuButton/` | Mobile menu toggle |
| NavigationItemButton | `buttons/NavigationItemButton/` | Nav item with skeleton |
| SkillSelectorButton | `buttons/SkillSelectorButton/` | Skill filter toggle |
| ThemeButton | `buttons/ThemeButton/` | Light/dark toggle |

### Icons (52 components)

**Technology Icons:**
- AWSIcon, BashIcon, CSS3Icon, CucumberIcon, DockerIcon
- FigmaIcon, GitIcon, GraphQLIcon, HTML5Icon, HerokuIcon
- JavaScriptIcon, JenkinsIcon, KafkaIcon, LinuxIcon, MongoIcon
- NextIcon, NodeIcon, PostgresIcon, RailsIcon, ReactIcon
- RedisIcon, ReduxIcon, RubyIcon, RustIcon, SASSIcon
- SolidityIcon, StorybookIcon, SvelteIcon, TailwindIcon
- TerraformIcon, TypeScriptIcon, UnixIcon

**Social Icons:**
- DribbbleIcon, GitHubIcon, GooglePlusIcon, LinkedInIcon
- PinterestIcon, TelegramIcon, TwitterIcon, WhatsAppIcon

**UI Icons:**
- ArrowIcon, CalendarIcon, CheckIcon, CopyIcon, LiIcon
- LogoIcon, MicrosoftIcon, MoonIcon, QuestionIcon
- SunIcon, WWWIcon

### Links (5 components)

| Component | Path | Description |
|-----------|------|-------------|
| BaseLink | `links/BaseLink/` | Base styled link |
| CalendarLink | `links/CalendarLink/` | Calendar booking link |
| ImageLink | `links/ImageLink/` | Image with link |
| NavigationItemLink | `links/NavigationItemLink/` | Nav menu link |
| WhatsAppLink | `links/WhatsAppLink/` | WhatsApp CTA |

### Texts (6 components)

| Component | Path | Description |
|-----------|------|-------------|
| ActiveMark | `texts/ActiveMark/` | Active state indicator |
| ActiveMarkFloating | `texts/ActiveMarkFloating/` | Floating active indicator |
| AnimatedNumber | `texts/AnimatedNumber/` | Counter animation |
| AnimatedTitle | `texts/AnimatedTitle/` | Animated heading |
| CircularText | `texts/CircularText/` | Rotating circular text |
| ParagraphText | `texts/ParagraphText/` | Styled paragraph |

### Shadows (2 components)

| Component | Description |
|-----------|-------------|
| BoxShadow | Standard box shadow wrapper |
| FeaturedBoxShadow | Enhanced shadow for featured items |

### HOCs (4 components)

| Component | Description |
|-----------|-------------|
| FramerImage | Framer Motion enhanced Image |
| History | Timeline history component |
| MainContainer | Main content wrapper |
| TransitionerLi | Animated list item |

---

## Molecules (`src/ui/molecules/`)

| Component | Description | Has Skeleton |
|-----------|-------------|--------------|
| AnimatedChildren | Page transition wrapper | No |
| Article | Article card | No |
| Author | Author info display | Yes |
| Calendar | Calendar link component | No |
| CopyEmail | Email with copy button | Yes |
| Copyright | Copyright text | Yes |
| CustomersSlider | Customer logo slider | No |
| Education | Education item | Yes |
| Experience | Job experience item | Yes |
| ExtraInfo | Additional info section | Yes |
| FeaturedArticle | Highlighted article | No |
| Hero | Hero section content | No |
| HireMe | Hire me CTA | No |
| Logo | Site logo | No |
| MovingImage | Parallax image | No |
| NavigationItems | Nav menu items | Yes |
| Paragraph | Styled paragraph | No |
| Resume | Resume download button | No |
| Skill | Skill badge | Yes |
| SkillSelector | Skill filter tabs | No |
| SocialNetworkLink | Social media link | Yes |
| Title | Section title | No |
| TransitionEffect | Page transition | No |
| WhatsApp | WhatsApp CTA | Yes |

---

## Organisms (`src/ui/organisms/`)

| Component | Description | Has Skeleton | Uses Hooks |
|-----------|-------------|--------------|------------|
| Academics | Education section | Yes | useAcademics |
| Biography | About section | Yes | useProfile |
| Chat | Contact chat panel | No | Redux: chatPanel |
| ExperienceStats | Stats counters | Yes | useExperienceStats |
| Experiences | Work history | Yes | useJobExperiences |
| Footer | Page footer | No | useContactPoints |
| Hiring | Hire CTA section | Yes | useProfile |
| Menu | Desktop navigation | Yes | useNavigationItems |
| MenuFloating | Mobile menu overlay | Yes | useNavigationItems |
| MenuFloatingClient | Client-side menu | No | Redux: menuPanel |
| NavBar | Top navigation bar | No | - |
| Skills | Skills section | Yes | useTechnologies |

---

## Overlays (`src/ui/overlays/`)

| Component | Description |
|-----------|-------------|
| Floating | Desktop floating panel |
| FloatingMobile | Mobile floating panel |

---

## Shared (`src/ui/shared/`)

| Component | Description |
|-----------|-------------|
| skeletons | Shared loading skeleton components |

---

## Component Patterns

### Skeleton Loading Pattern

Components with loading states follow this pattern:

```jsx
// Component with skeleton
export default function ComponentName() {
  const { data, isLoading, isError } = useHook();

  if (isLoading) return <ComponentNameSkeleton />;
  if (isError) return <ErrorMessage />;

  return <ComponentContent data={data} />;
}
```

### Client Component Pattern

Components using hooks or state are marked:

```jsx
"use client";

import { useHook } from "@/hooks";
// ...
```

### Import Aliases

```javascript
// Buttons
import { ArrowButton } from "@/buttons";

// Icons
import { GitHubIcon } from "@/icons";

// Molecules
import { Hero, Logo } from "@/molecules";

// Organisms
import { NavBar, Footer } from "@/organisms";

// Overlays
import { Floating } from "@/overlays";
```
