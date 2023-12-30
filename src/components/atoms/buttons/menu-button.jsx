import clsx from "clsx";

const ButtonTick = ({ className }) => {
  return <span className={`menu_button-tick ${className}`}></span>;
};

export default function MenuButton({ handleClick, isOpen }) {
  return (
    <button className="menu_button" onClick={handleClick}>
      <ButtonTick
        className={clsx({
          "rotate-45 translate-y-1": isOpen,
          "-translate-y-0.5": !isOpen,
        })}
      />
      <ButtonTick
        className={clsx(`my-0.5`, {
          "opacity-0": isOpen,
          "opacity-100": !isOpen,
        })}
      />
      <ButtonTick
        className={clsx({
          "-rotate-45 -translate-y-1": isOpen,
          "translate-y-0.5": !isOpen,
        })}
      />
    </button>
  );
}
