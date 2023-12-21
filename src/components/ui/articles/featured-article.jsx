import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";
import FeaturedBoxShadow from "@/components/ui/featured-box-shadow";

export default function FeaturedArticle({ img, title, time, summary, link }) {
  return (
    <li
      className="relative col-span-1 w-full p-4 dark:text-light bg-light
      dark:bg-dark border-2 border-solid border-dark dark:border-light 
      rounded-2xl"
    >
      <FeaturedBoxShadow />

      <Link
        href={link}
        target="_blank"
        className="w-full inline-block cursor-pointer overflow-hidden rounded-lg"
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <Link href={link} target="_blank">
        <h2 className="capitalize text-2xl font-bold my-2 mt-4 hover:underline">
          {title}
        </h2>
      </Link>

      <p className="text-sm mb-2">{summary}</p>

      <span className="font-semibold text-primary dark:text-primaryDark">
        {time}
      </span>
    </li>
  );
}
