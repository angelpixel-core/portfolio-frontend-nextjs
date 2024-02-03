import "./styles.css";

import { asyncFetchProfile } from "@/lib/data/_index";

import Link from "next/link";
import { WhatsAppIcon } from "@/atoms/icons/_index";

export default async function WhatsAppLink({ text }) {
  const { whatsapp } = await asyncFetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <>
      <Link href={whatsapp} target="_blank" className="whatsapp_link">
        {text}
      </Link>

      <Link href={whatsapp} target="_blank" className="whatsapp_icon-container">
        <WhatsAppIcon className="whatsapp_link-icon" />
      </Link>
    </>
  );
}
