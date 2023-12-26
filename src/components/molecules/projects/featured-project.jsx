import BoxShadow from "@/atoms/shadows/box-shadow";
import Link from "next/link";
import { FramerImage } from "@/hoc/framer-image";
import GithubIcon from "@/atoms/icons/github-icon";

export default function FeaturedProject({
  tags,
  title,
  summary,
  img,
  link,
  github,
}) {
  return (
    <article
      className="
        relative
        flex lg:flex-col
        items-center justify-between
        w-full
        p-12 lg:p-8 xs:p-4

        bg-light dark:bg-dark
        border border-solid border-dark dark:border-light 
        rounded-2xl xs:rounded-br-3xl

        shadow-2xl
      "
    >
      <BoxShadow />

      <Link
        href={link}
        target="_blank"
        className="
          w-1/2 lg:w-full
          cursor-pointer
          overflow-hidden
          rounded-lg
          dark:text-light
        "
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

      <div
        className="
          w-1/2 lg:w-full
          flex flex-col items-start justify-between
          pl-6 lg:pl-0 lg:pt-6
        "
      >
        <span
          className="
            font-medium
            text-primary dark:text-primaryDark
            text-xl xs:text-base
          "
        >
          {tags}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2
            className="
              w-full
              my-2
              font-bold
              dark:text-light
              text-left 
              text-4xl sm:text-sm
            "
          >
            {title}
          </h2>
        </Link>

        <p
          className="
            flex
            my-2
            font-medium
            text-dark
            dark:text-light
            sm:text-sm
          "
        >
          {summary}
        </p>

        <div
          className="
            flex items-center
            mt-2
          "
        >
          <Link href={github} target="_blank" className="w-10">
            <GithubIcon />
          </Link>

          <Link
            href={link}
            target="_blank"
            className="
              font-semibold
              ml-4
              p-2 px-6 sm:px-4
              rounded-lg
              bg-dark dark:bg-light
              text-light dark:text-dark
              text-lg sm:text-base
            "
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
}
