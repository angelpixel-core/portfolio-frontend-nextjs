import "./styles.css";

import { Paragraph } from "@/atoms/texts/_index";

import { fetchBiography } from "@/lib/data/_index";

export async function Biography() {
  const { content } = await fetchBiography({
    email: process.env.PROFILE_EMAIL,
  });

  const BiographyContent = () => {
    return (
      <>
        {content.map((text, index) => (
          <Paragraph key={index} text={text} />
        ))}
      </>
    );
  };

  return (
    <>
      <h2 className="biography-title">biography</h2>
      <BiographyContent />
    </>
  );
}
