import TransitionerLi from "@/hoc/transitioner-li";

export default function Experience({
  position,
  company,
  companyLink,
  time,
  address,
  work,
}) {
  return (
    <TransitionerLi data={work}>
      <h3
        className="
          capitalize
          font-bold
          text-2xl sm:text-xl xs:text-lg
        "
      >
        {position}&nbsp;
        <a
          href={companyLink}
          target="_blank"
          className="text-primary dark:text-primaryDark capitalize"
        >
          @{company}
        </a>
      </h3>

      <span
        className="
          capitalize
          font-medium
          text-dark/75 dark:text-light/75
          xs:text-sm
        "
      >
        {time} | {address}
      </span>
    </TransitionerLi>
  );
}
