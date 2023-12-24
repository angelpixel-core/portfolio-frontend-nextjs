export default function Paragraph({ text, className = "" }) {
  return <p className={`font-medium ${className}`}>{text}</p>;
}
