import Link from "next/link";
import { FramerImage } from "@/components/ui/framer-image";
import { GithubIcon } from "@/components/ui/icons";
import FeaturedBoxShadow from "@/components/ui/featured-box-shadow";

export default function Project({ type, title, img, link, github }) {
  return (
    <article
      className="w-full flex flex-col item-center justify-center rounded-2xl
      border border-solid border-dark dark:border-light bg-light dark:bg-dark p-6
      relative"
    >
      <FeaturedBoxShadow />

      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg dark:text-light"
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <div className="w-full flex flex-col items-start justify-between mt-4">
        <span className="font-medium text-xl text-primary dark:text-primaryDark">
          {type}
        </span>

        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold dark:text-light">
            {title}
          </h2>
        </Link>

        <div className="w-full mt-2 flex items-center justify-between">
          <Link
            href={link}
            target="_blank"
            className="text-lg font-semibold underline dark:text-light"
          >
            Visit
          </Link>

          <Link href={github} target="_blank" className="w-8">
            <GithubIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
