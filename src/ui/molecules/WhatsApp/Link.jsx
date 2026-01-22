"use client";

import "./styles.css";

import { default as NextLink } from "next/link";
import { WhatsAppIcon } from "@/icons";
import { useProfile } from "@/domains/profile/queries";

const Link = ({ text }) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  const whatsappUrl =
    isLoading || isError || !profile ? "#" : profile.whatsapp || "#";

  return (
    <>
      <NextLink href={whatsappUrl} target="_blank" className="whatsapp_link">
        {text}
      </NextLink>

      <NextLink
        href={whatsappUrl}
        target="_blank"
        className="whatsapp_icon-container"
      >
        <WhatsAppIcon className="whatsapp_link-icon" />
      </NextLink>
    </>
  );
};

export default Link;
