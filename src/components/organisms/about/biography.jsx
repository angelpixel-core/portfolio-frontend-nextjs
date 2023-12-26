import { fetchBiography } from "@/data/biography";

import Paragraph from "@/atoms/texts/paragraph";

export default function Biography() {
  const title = "Biography";
  const biography = fetchBiography();

  return (
    <>
      <h2
        className="mb-4 text-lg font-bold` uppercase
        text-dark/75 dark:text-light/75"
      >
        {title}
      </h2>

      {biography.map((text, index) => (
        <Paragraph key={index} text={text} />
      ))}
    </>
  );
}
