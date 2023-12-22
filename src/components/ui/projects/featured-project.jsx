import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";
import BoxShadow from "@/components/ui/box-shadow";

export default function FeaturedProject({
  type,
  title,
  summary,
  img,
  link,
  github,
}) {
  return (
    <article
      className="relative
      flex lg:flex-col
      items-center justify-between
      w-full
      p-12 lg:p-8 xs:p-4
      bg-light dark:bg-dark
      border border-solid border-dark dark:border-light 
      shadow-2xl
      rounded-2xl xs:rounded-br-3xl"
    >
      <BoxShadow />

      <Link
        href={link}
        target="_blank"
        className="w-1/2 lg:w-full
        cursor-pointer overflow-hidden rounded-lg"
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
        className="flex flex-col items-start justify-between
        pl-6 lg:pl-0 lg:pt-6
        w-1/2 lg:w-full"
      >
        <span
          className="text-primary dark:text-primaryDark font-medium
          text-xl xs:text-base"
        >
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2
            className="my-2 w-full text-left font-bold dark:text-light
            text-4xl sm:text-sm"
          >
            {title}
          </h2>
        </Link>

        <p className="my-2 flex font-medium text-dark dark:text-light sm:text-sm">
          {summary}
        </p>

        <div className="mt-2 flex items-center">
          <Link href={github} target="_blank" className="w-10">
            <GithubIcon />
          </Link>

          <Link
            href={link}
            target="_blank"
            className="font-semibold
            ml-4
            p-2 px-6 sm:px-4
            rounded-lg
            bg-dark dark:bg-light
            text-light dark:text-dark
            text-lg sm:text-base"
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
}
