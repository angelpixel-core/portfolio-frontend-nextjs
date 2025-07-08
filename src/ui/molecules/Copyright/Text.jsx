// import { Profile } from "@/models";

const Text = async () => {
  // const { year } = await Profile.findBy({ id: 1 }).then(
  const { year } = await fetch(
    "http://localhost:8000/api/v1/site/profiles/1"
  ).then((res) => res.json());

  return <>{year}</>;
};

export default Text;
