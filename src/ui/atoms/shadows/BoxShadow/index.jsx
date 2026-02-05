import "./styles.css";

export const BoxShadow = ({ variant = "default" }) => {
  const className =
    variant === "list-item" ? "box-shadow--list-item" : "box-shadow";
  return <div className={className} />;
};
