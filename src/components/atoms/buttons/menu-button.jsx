export default function MenuButton({ handleClick, isOpen }) {
  return (
    <button
      className="flex flex-col justify-center items-center hidden lg:flex"
      onClick={handleClick}
    >
      <span
        className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm
          transition-all duration-300 ease-out
          ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}
        `}
      ></span>
      <span
        className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm my-0.5
          transition-all duration-300 ease-out
          ${isOpen ? "opacity-0" : "opacity-100"}
        `}
      ></span>
      <span
        className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm
          transition-all duration-300 ease-out
          ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}
        `}
      ></span>
    </button>
  );
}
