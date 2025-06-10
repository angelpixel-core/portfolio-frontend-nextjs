import { Profile } from "@/models/_index";

const email = process.env.PROFILE_EMAIL;

export default async function BrandText() {
  const { year } = await Profile.fetchBy({ email }).then((profile) => ({
    year: profile.year,
  }));

  return <>{year}</>;
}
