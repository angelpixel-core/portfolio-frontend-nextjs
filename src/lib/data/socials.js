const all = () => [
  {
    name: "dribbble",
    href: "https://dribbble.com",
    enabled: false,
    styles: "",
  },
  {
    name: "github",
    href: "https://github.com/angelthunder",
    enabled: true,
    styles:
      "bg-primaryDarkGitHub dark:bg-primaryGitHub text-primaryGitHub dark:text-primaryDarkGitHub rounded-full",
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/angelszymczak",
    enabled: true,
    styles:
      "bg-primaryDarkLinkedIn dark:bg-primaryLinkedIn text-primaryLinkedIn dark:text-primaryDarkLinkedIn rounded-md",
  },
  {
    name: "pinterest",
    href: "https://pinterest.com",
    enabled: false,
    styles: "bg-light",
  },
  {
    name: "telegram",
    href: "https://t.me/angelszymczak",
    enabled: true,
    styles:
      "bg-primaryTelegram dark:bg-primaryDarkTelegram text-primaryDarkTelegram dark:text-primaryTelegram rounded-full",
  },
  {
    name: "twitter",
    href: "https://twitter.com",
    enabled: false,
    styles: "",
  },
];

export function fetchSocials() {
  return all().filter((item) => item.enabled);
}
