export const fetchFeatures = async () => {
  try {
    const features = [
      { href: "/", title: "Home" },
      { href: "/about", title: "About" },
      { href: "/projects", title: "Projects" },
      { href: "/articles", title: "Articles" },
    ];

    return features;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch features.");
  }
};
