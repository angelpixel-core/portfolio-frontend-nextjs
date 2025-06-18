import { CalendarLink } from "@/atoms/links";

import { Profile } from "@/models";
const email = process.env.PROFILE_EMAIL;

export async function Link({ text, className }) {
  const { href } = await Profile.fetchBy({ email }).then((profile) => ({
    href: profile.calendly,
  }));

  return (
    <>
      <CalendarLink href={href} text={text} className={className} />
    </>
  );
}
