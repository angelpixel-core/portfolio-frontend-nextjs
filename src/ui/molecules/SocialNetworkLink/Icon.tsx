import DribbbleIcon from "@/atoms/icons/DribbbleIcon";
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import PinterestIcon from "@/atoms/icons/PinterestIcon";
import TelegramIcon from "@/atoms/icons/TelegramIcon";
import TwitterIcon from "@/atoms/icons/TwitterIcon";
import WhatsAppIcon from "@/atoms/icons/WhatsAppIcon";
import QuestionIcon from "@/atoms/icons/QuestionIcon";
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
