import { Paragraph } from "@/atoms/texts/_index";

import { Profile } from "@/models/_index";

const email = process.env.PROFILE_EMAIL;

export async function BiographyText() {
  const { biography } = await Profile.findBy({ email }).then((profile) => ({
    biography: profile.biography,
  }));

  return (
    <>
      {biography.map((row, idx) => (
        <Paragraph key={idx} text={row} />
      ))}
    </>
  );
}
