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
  dribbble: DribbbleIcon,
  github: GitHubIcon,
  GitHub: GitHubIcon,
  MapPin: GitHubIcon,
  linkedin: LinkedInIcon,
  LinkedIn: LinkedInIcon,
  Map: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  Telegram: TelegramIcon,
  Phone: TelegramIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsAppIcon,
  WhatsApp: WhatsAppIcon,
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
