import { fetchBiography } from "@/data/biography/_index";
import { Paragraph } from "@/atoms/texts/_index";

export const Biography = () => {
  const title = "Biography";
  const biography = fetchBiography();

  return (
    <>
      <h2 className="biography-title">{title}</h2>

      {biography.map((text, index) => (
        <Paragraph key={index} text={text} />
      ))}
    </>
  );
};
