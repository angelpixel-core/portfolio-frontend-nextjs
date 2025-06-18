import { Paragraph } from "@/atoms/texts";

import { Profile } from "@/models";

const email = process.env.PROFILE_EMAIL;

export async function BiographyText() {
  const { biography } = await Profile.fetchBy({ email }).then((profile) => ({
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
