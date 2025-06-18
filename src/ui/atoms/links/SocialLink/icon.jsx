import {
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/atoms/icons";

const iconMapping = {
  dribbble: DribbbleIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
};

export function Icon({ name, className }) {
  const IconComponent = iconMapping[name];

  return <IconComponent className={className} />;
}
