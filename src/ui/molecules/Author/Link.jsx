import "./styles.css";

import { default as NextLink } from "next/link";
// import { Profile } from "@/models";

const Link = async () => {
  // const profile = await Profile.findBy({ id: 1 });
  const { github, brand } = await fetch(
    "http://localhost:8000/api/v1/site/profiles/1"
  ).then((res) => res.json());

  return (
    <NextLink href={github} target="_blank" className="author-link">
      {brand}
    </NextLink>
  );
};

export default Link;
