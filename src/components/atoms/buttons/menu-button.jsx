import clsx from "clsx";

export default function MenuButton({ handleClick, isOpen }) {
  return (
    <button
      className="
        flex flex-col lg:flex
        justify-center items-center
        hidden
      "
      onClick={handleClick}
    >
      <span
        className={clsx(
          `
            block
            bg-dark dark:bg-light
            h-0.5 w-6
            rounded-sm
            transition-all duration-300 ease-out
          `,
          {
            "rotate-45 translate-y-1": isOpen,
            "-translate-y-0.5": !isOpen,
          },
        )}
      ></span>
      <span
        className={clsx(
          `
            block
            bg-dark dark:bg-light
            h-0.5 w-6
            my-0.5
            rounded-sm
            transition-all duration-300 ease-out
          `,
          {
            "opacity-0": isOpen,
            "opacity-100": !isOpen,
          },
        )}
      ></span>
      <span
        className={clsx(
          `
            block
            bg-dark dark:bg-light
            h-0.5 w-6
            rounded-sm
            transition-all duration-300 ease-out
          `,
          {
            "-rotate-45 -translate-y-1": isOpen,
            "translate-y-0.5": !isOpen,
          },
        )}
      ></span>
    </button>
  );
}
