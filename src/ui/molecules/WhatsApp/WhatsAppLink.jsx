import "./styles.css";

import { Profile } from "@/models/_index";

import Link from "next/link";
import { WhatsAppIcon } from "@/atoms/icons/_index";

const email = process.env.PROFILE_EMAIL;

export default async function WhatsAppLink({ text }) {
  const { whatsapp } = await Profile.fetchBy({ email }).then((profile) => ({
    whatsapp: profile.whatsapp,
  }));

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
