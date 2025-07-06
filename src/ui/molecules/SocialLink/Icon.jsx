import {
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  QuestionIcon,
} from "@/atoms/icons";

const iconMapping = {
  dribbble: DribbbleIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
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
