import "./styles.css";

const ParagraphText = ({ text, className = "" }) => {
  return <p className={`paragraph ${className}`}>{text}</p>;
};

export default ParagraphText;
