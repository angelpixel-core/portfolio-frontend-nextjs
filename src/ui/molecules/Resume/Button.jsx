import { ArrowButton } from "@/atoms/buttons";
import { Profile } from "@/models";

export async function Button() {
  const profile = await Profile.findBy({ id: 1 });

  return <ArrowButton text="resume" href={profile.resume} />;
}
