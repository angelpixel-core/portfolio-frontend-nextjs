import "./styles.css";

export function Paragraph({ text, className = "" }) {
  return <p className={`paragraph ${className}`}>{text}</p>;
}
