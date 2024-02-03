import { asyncFetchProfile } from "@/lib/data/_index";

export default async function BrandText() {
  const { year } = await asyncFetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return <>{year}</>;
}
