import { ArrowButton } from "@/atoms/buttons/_index";

import { Profile } from "@/models/_index";
const email = process.env.PROFILE_EMAIL;

export async function Button() {
  const { resume } = await Profile.findBy({ email }).then((profile) => ({
    resume: profile.resume,
  }));

  return <ArrowButton text="resume" href={resume} />;
}
