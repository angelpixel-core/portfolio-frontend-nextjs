import { Profile } from "@/models";

const Text = async () => {
  const profile = await Profile.findBy({ id: 1 });

  return <>{profile.year}</>;
};

export default Text;
