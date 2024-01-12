import "./styles.css";

export const MainContainer = ({ children, className }) => {
  return <div className={`main-container ${className}`}>{children}</div>;
};
