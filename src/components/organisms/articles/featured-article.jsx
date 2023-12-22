import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";
import BoxShadow from "@/components/ui/box-shadow";

export default function FeaturedArticle({ img, title, time, summary, link }) {
  return (
    <article
      className="relative
      col-span-1
      w-full
      p-4
      dark:text-light
      bg-light dark:bg-dark
      border-2 border-solid border-dark dark:border-light 
      rounded-2xl"
    >
      <BoxShadow />

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
          priority
          sizes="
            (max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            50vw
          "
        />
      </Link>

      <Link href={link} target="_blank">
        <h2
          className="capitalize font-bold hover:underline
          my-2 mt-4
          text-2xl xs:text-lg"
        >
          {title}
        </h2>
      </Link>

      <p className="text-sm mb-2">{summary}</p>

      <span className="font-semibold text-primary dark:text-primaryDark">
        {time}
      </span>
    </article>
  );
}
