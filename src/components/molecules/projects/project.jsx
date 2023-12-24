import Link from "next/link";
import { FramerImage } from "@/hoc/framer-image";
import GithubIcon from "@/atoms/icons/github-icon";
import BoxShadow from "@/atoms/shadows/box-shadow";

export default function Project({ tags, title, img, link, github }) {
  return (
    <article
      className="
        relative
        flex flex-col
        item-center justify-center
        w-full
        p-6 xs:p-4
      
        bg-light dark:bg-dark
        border border-solid border-dark dark:border-light
        rounded-2xl xs:rounded-br-3xl
      "
    >
      <BoxShadow />

      <Link
        href={link}
        target="_blank"
        className="
          w-full
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
        />
      </Link>

      <div
        className="
          w-full
          flex flex-col items-start justify-between
          mt-4
        "
      >
        <span
          className="
            font-medium
            text-primary dark:text-primaryDark
            text-xl md:text-base
          "
        >
          {tags}
        </span>

        <Link
          href={link}
          target="_blank"
          className="underline-offset-2 hover:underline"
        >
          <h2
            className="
              w-full 
              my-2
              font-bold
              dark:text-light
              text-left
              text-3xl lg:text-2xl
            "
          >
            {title}
          </h2>
        </Link>

        <div
          className="
            flex items-center justify-between
            w-full
            mt-2
          "
        >
          <Link
            href={link}
            target="_blank"
            className="
              font-semibold
              underline
              dark:text-light
              text-lg md:text-base
            "
          >
            Visit
          </Link>

          <Link href={github} target="_blank" className="w-8 md:w-6">
            <GithubIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
