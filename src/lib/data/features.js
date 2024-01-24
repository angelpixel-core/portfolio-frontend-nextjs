const all = () => [
  { name: "Home", href: "/", enabled: true },
  { name: "About", href: "/about", enabled: true },
  { name: "Projects", href: "/projects", enabled: true },
  { name: "Articles", href: "/articles", enabled: true },
  { name: "other", href: "/other", enabled: false },
];

export function fetchFeatures() {
  return all().filter((item) => item.enabled);
}
