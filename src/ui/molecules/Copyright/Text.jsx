import { Profile } from "@/models";

const email = process.env.PROFILE_EMAIL;

const Text = async () => {
  const { year } = await Profile.fetchBy({ email }).then((profile) => ({
    year: profile.year,
  }));

  return <>{year}</>;
};

export default Text;
