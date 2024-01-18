const all = () => [
  { name: "home", href: "/", enabled: true },
  { name: "about", href: "/about", enabled: true },
  { name: "projects", href: "/projects", enabled: true },
  { name: "articles", href: "/articles", enabled: true },
  { name: "other", href: "/other", enabled: false },
];

export function fetchFeatures() {
  return all().filter((item) => item.enabled);
}
