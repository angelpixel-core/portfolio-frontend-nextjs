import TransitionerLi from "@/hoc/transitioner-li";

export default function Education({ type, time, place, info }) {
  return (
    <TransitionerLi data={info}>
      <h3
        className="
          capitalize
          font-bold
          text-2xl sm:text-xl xs:text-lg
        "
      >
        {type}&nbsp;
      </h3>

      <span
        className="
          capitalize
          font-medium
          text-dark/75 dark:text-light/75
          xs:text-sm
        "
      >
        {time} | {place}
      </span>
    </TransitionerLi>
  );
}
