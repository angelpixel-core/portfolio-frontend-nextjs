// import { sql } from "@vercel/postgres";

export function fetchFeatures() {
  // noStore()
  try {
    // const features = await sql`
    //   SELECT *
    //   FROM features
    // `;
    //
    // return features.rows;
    //
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
}
