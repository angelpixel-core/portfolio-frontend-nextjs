import { CalendarLink } from "@/links";

import { Profile } from "@/models";

const Link = async ({ text, className }) => {
  const profile = await Profile.findBy({ id: 1 });

  return (
    <>
      <CalendarLink href={profile.calendly} text={text} className={className} />
    </>
  );
};

export default Link;
