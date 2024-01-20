import "./styles.css";

import { Paragraph } from "@/atoms/texts/_index";

export const Biography = ({ content }) => {
  return (
    <>
      <h2 className="biography-title">biography</h2>

      {content.map((text, index) => (
        <Paragraph key={index} text={text} />
      ))}
    </>
  );
};
