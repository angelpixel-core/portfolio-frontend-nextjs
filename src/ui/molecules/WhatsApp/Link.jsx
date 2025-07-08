import "./styles.css";

import { default as NextLink } from "next/link";
import { WhatsAppIcon } from "@/icons";
import { Profile } from "@/models";

const Link = async ({ text }) => {
  const profile = await Profile.findBy({ id: 1 });

  return (
    <>
      <NextLink
        href={profile.whatsapp}
        target="_blank"
        className="whatsapp_link"
      >
        {text}
      </NextLink>

      <NextLink
        href={profile.whatsapp}
        target="_blank"
        className="whatsapp_icon-container"
      >
        <WhatsAppIcon className="whatsapp_link-icon" />
      </NextLink>
    </>
  );
};

export default Link;
