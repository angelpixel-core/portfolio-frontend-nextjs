import { Paragraph } from "@/atoms/texts";
import { Profile } from "@/models";

export async function BiographyText() {
  const profile = await Profile.findBy({ id: 1 });

  return (
    <>
      {profile.biography.map((row, idx) => (
        <Paragraph key={idx} text={row} />
      ))}
    </>
  );
}
