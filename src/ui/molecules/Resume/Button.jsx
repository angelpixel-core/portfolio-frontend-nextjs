import { ArrowButton } from "@/atoms/buttons";
// import { Profile } from "@/models";

const Button = async () => {
  // const profile = await Profile.findBy({ id: 1 });
  const { resume } = await fetch(
    "http://localhost:8000/api/v1/site/profiles/1"
  ).then((res) => res.json());

  return <ArrowButton text="resume" href={resume} />;
};

export default Button;
