import { CalendarLink } from "@/links";

import { Profile } from "@/models";
const email = process.env.PROFILE_EMAIL;

const Link = async ({ text, className }) => {
  const { href } = await Profile.fetchBy({ email }).then((profile) => ({
    href: profile.calendly,
  }));

  return (
    <>
      <CalendarLink href={href} text={text} className={className} />
    </>
  );
};

export default Link;
