import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";

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
      className="w-full flex items-center justify-between relative
      rounded-br-3xl rounded-3xl border border-solid border-dark dark:border-light
      bg-light dark:bg-dark shadow-2xl p-12"
    >
      <div
        className="absolute top-2 left-2 -z-10 w-[101%] h-[103%]
        rounded-[2rem] bg-dark dark:bg-light rounded-br-3xl"
      />

      <Link
        href={link}
        target="_blank"
        className="w-1/2 cursor-pointer overflow-hidden rounded-lg"
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <div className="w-1/2 flex flex-col items-start justify-between pl-6">
        <span className="text-primary dark:text-primaryDark font-medium text-xl">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-4xl font-bold dark:text-light">
            {title}
          </h2>
        </Link>

        <p className="my-2 flex font-medium text-dark">{summary}</p>

        <div className="mt-2 flex items-center">
          <Link href={github} target="_blank" className="w-10">
            <GithubIcon />
          </Link>

          <Link
            href={link}
            target="_blank"
            className="ml-4 rounded-lg p-2 px-6 text-lg font-semibold bg-dark
            dark:bg-light text-light dark:text-dark"
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
}
