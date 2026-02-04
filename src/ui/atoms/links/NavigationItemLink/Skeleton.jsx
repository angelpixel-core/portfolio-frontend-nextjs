import "./styles.css";

const Skeleton = ({ width = "3rem" }) => {
  return (
    <span className="menu-bar__link navigation-item_name" aria-hidden="true">
      <span
        className="block h-[1em] rounded bg-dark/10 dark:bg-light/10 animate-pulse"
        style={{ width }}
      />
    </span>
  );
};

export default Skeleton;
