import {
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsAppIcon,
  QuestionIcon,
} from "@/atoms/icons";
import { logger } from "@/lib/logger";

const iconMapping = {
  // Standard social network mappings (lowercase + PascalCase)
  dribbble: DribbbleIcon,
  Dribbble: DribbbleIcon,
  github: GitHubIcon,
  GitHub: GitHubIcon,
  linkedin: LinkedInIcon,
  LinkedIn: LinkedInIcon,
  pinterest: PinterestIcon,
  Pinterest: PinterestIcon,
  telegram: TelegramIcon,
  Telegram: TelegramIcon,
  twitter: TwitterIcon,
  Twitter: TwitterIcon,
  whatsapp: WhatsAppIcon,
  WhatsApp: WhatsAppIcon,
  // Legacy mappings from API (kept for backward compatibility)
  MapPin: GitHubIcon,
  Map: LinkedInIcon,
  Phone: TelegramIcon,
  Email: WhatsAppIcon,
};

const Icon = ({ name, className }) => {
  const IconComponent = iconMapping[name];

  if (!IconComponent) {
    logger.warn(
      "SocialNetworkLink",
      `Icon "${name}" not found in iconMapping`,
      { fallback: "QuestionIcon" }
    );
    return <QuestionIcon className={className} />;
  }

  return <IconComponent className={className} />;
};

export default Icon;
