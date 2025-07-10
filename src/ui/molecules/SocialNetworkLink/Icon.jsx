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
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  pinterest: PinterestIcon,
  Telegram: TelegramIcon,
  Twitter: TwitterIcon,
  WhatsApp: WhatsAppIcon,
};

const Icon = ({ name, className }) => {
  const IconComponent = iconMapping[name];

  if (!IconComponent) {
    console.warn(`⚠ Social icon "${name}" is not defined in iconMapping.`);
    return <QuestionIcon className={className} />;
  }

  return <IconComponent className={className} />;
};

export default Icon;
