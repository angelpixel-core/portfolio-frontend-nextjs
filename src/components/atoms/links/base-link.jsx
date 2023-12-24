import Link from "next/link";

export default function BaseLink({ href, target, text, className }) {
  return (
    <Link
      href={href}
      target={target}
      className={`underline underline-offset-2 ${className}`}
    >
      {text}
    </Link>
  );
}
