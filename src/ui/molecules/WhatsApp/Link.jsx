import "./styles.css";

import { Profile } from "@/models";

import { default as NextLink } from "next/link";
import { WhatsAppIcon } from "@/icons";

const email = process.env.PROFILE_EMAIL;

const Link = async ({ text }) => {
  const { whatsapp } = await Profile.fetchBy({ email }).then((profile) => ({
    whatsapp: profile.whatsapp,
  }));

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
