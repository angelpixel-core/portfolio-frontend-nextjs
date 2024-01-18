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
    styles: "bg-light dark:bg-dark rounded-full",
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/angelszymczak",
    enabled: true,
    styles: "",
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
    styles: "",
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
