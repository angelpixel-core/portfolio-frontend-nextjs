import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";

export default function Article({ img, title, date, link }) {
  return (
    <li
      className="relative w-full p-4 py-6 my-4 rounded-xl flex items-center
      justify-between bg-light text-dark first:mt-0 border border-solid
      border-dark border-r-4 border-b-4"
    >

      <Link href={link} target="_blank">
        <h2 className="capitalize text-xl font-semibold hover:underline">
          {title}
        </h2>
      </Link>

      <span className="text-primary font-semibold pl-4">{date}</span>
    </li>
  );
}
