import "./styles.css";

export const Paragraph = ({ text, className = "" }) => {
  return <p className={`paragraph ${className}`}>{text}</p>;
};
