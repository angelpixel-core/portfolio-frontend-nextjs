import { FeaturedBoxShadow } from "@/atoms/shadows/_index";
import { HeroImage } from "@/molecules/home/_index";
import {
  Biography,
  Extras,
  Skills,
  Experiences,
  Academics,
} from "@/organisms/about/_index";

import {
  fetchAcademics,
  fetchBiography,
  fetchExperiences,
  fetchExtras,
  fetchSkills,
} from "@/lib/data/_index";

export default async function Page() {
  const { content } = await fetchBiography({
    email: process.env.PROFILE_EMAIL,
  });

  const academics = await fetchAcademics({
    email: process.env.PROFILE_EMAIL,
  });
  const skills = await fetchSkills({
    email: process.env.PROFILE_EMAIL,
  });
  const experiences = await fetchExperiences({
    email: process.env.PROFILE_EMAIL,
  });
  const extras = await fetchExtras({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <>
      <div className="about-content">
        <div className="about_biography-container">
          <Biography content={content} />
        </div>

        <div className="about-hero_image-container">
          <FeaturedBoxShadow />

          <HeroImage name="profile" className="about-hero_image" sizes="33vw" />
        </div>

        <Extras items={extras} />
      </div>

      <Skills items={skills} />

      <Experiences items={experiences} />

      <Academics items={academics} />
    </>
  );
}
