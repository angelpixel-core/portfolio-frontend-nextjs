import { CalendarLink } from "@/links";
// import { Profile } from "@/models";

const Link = async ({ text, className }) => {
  // const profile = await Profile.findBy({ id: 1 });
  const { calendly } = await fetch(
    "http://localhost:8000/api/v1/site/profiles/1"
  ).then((res) => res.json());

  return <CalendarLink href={calendly} text={text} className={className} />;
};

export default Link;
