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
  Email: WhatsAppIcon,
};

const Icon = ({ name, className }) => {
  const IconComponent = iconMapping[name];

  if (!IconComponent) {
    console.warn(`🔴 Social icon "${name}" is not defined in iconMapping.`);
    return <QuestionIcon className={className} />;
  }

  return <IconComponent className={className} />;
};

export default Icon;
