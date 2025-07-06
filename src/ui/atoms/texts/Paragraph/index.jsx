import "./styles.css";

const Paragraph = ({ text, className = "" }) => {
  return <p className={`paragraph ${className}`}>{text}</p>;
};

export default Paragraph;
