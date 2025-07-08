import "./styles.css";

import { default as NextLink } from "next/link";
import { WhatsAppIcon } from "@/icons";
// import { Profile } from "@/models";

const Link = async ({ text }) => {
  // const profile = await Profile.findBy({ id: 1 });
  const { whatsapp } = await fetch(
    "http://localhost:8000/api/v1/site/profiles/1"
  ).then((res) => res.json());

  return (
    <>
      <NextLink href={whatsapp} target="_blank" className="whatsapp_link">
        {text}
      </NextLink>

      <NextLink
        href={whatsapp}
        target="_blank"
        className="whatsapp_icon-container"
      >
        <WhatsAppIcon className="whatsapp_link-icon" />
      </NextLink>
    </>
  );
};

export default Link;
