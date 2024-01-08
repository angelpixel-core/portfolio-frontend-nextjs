import { FeaturedBoxShadow } from "@/atoms/shadows/_index";
import { HeroImage } from "@/molecules/home/_index";
import {
  Biography,
  Extras,
  Skills,
  Experiences,
  Academics,
} from "@/organisms/about/_index";

export default async function Page() {
  return (
    <>
      <div className="about-content">
        <div className="about_biography-container">
          <Biography />
        </div>

        <div className="about-hero_image-container">
          <FeaturedBoxShadow />

          <HeroImage name="profile" className="about-hero_image" sizes="33vw" />
        </div>

        <Extras />
      </div>

      <Skills />

      <Experiences />

      <Academics />
    </>
  );
}
