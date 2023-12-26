import Skill from "@/molecules/about/skill";

import { fetchSkills } from "@/data/skills";

export default async function Skills() {
  const tittle = "Skills";
  const skills = await fetchSkills();

  return (
    <>
      <h2
        className="
        w-full
        mt-64 md:mt-32
        mb-8 md:mb-4 sm:mb-2
        font-bold
        text-8xl md:text-6xl
        text-center
        "
      >
        {tittle}
      </h2>

      <div
        className="
          relative
          flex items-center justify-center
          w-full
          rounded-full
          h-screen lg:h-[80vh] sm:h-[60vh] xs:h-[50vh]
          bg-circularLight dark:bg-circularDark
          lg:bg-circurlarLightLg lg:dark:bg-circularDarkLg
          md:bg-circurlarLightMd md:dark:bg-circularDarkMd
          sm:bg-circurlarLightSm smm:dark:bg-circularDarkSm
        "
      >
        <Skill
          key={0}
          name={skills[0].name}
          whileHover={{ scale: 1.05 }}
          className="
            relative
            
            p-8 lg:p-6 md:p-4 xs:p-2
          "
        />

        {skills.map(
          (skill, index) =>
            index > 0 && (
              <Skill
                key={index}
                name={skill.name}
                whileHover={{ scale: 1.05 }}
                initial={{ x: 0, y: 0 }}
                whileInView={{
                  x: skill.x,
                  y: skill.y,
                  transition: { duration: 1.5 },
                }}
                viewport={{ once: true }}
                className="
                  absolute

                  px-6 lg:px-4 md:px-3
                  py-3 lg:py-2 md:py-1.5 
                "
              />
            ),
        )}
      </div>
    </>
  );
}
