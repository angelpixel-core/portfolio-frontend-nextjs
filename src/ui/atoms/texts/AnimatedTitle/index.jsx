import "./styles.css";

import Title from "./Title";

const AnimatedTitle = ({ className = "" }) => {
  return (
    <div className="animated-title_container">
      <Title className={className} />
    </div>
  );
};

export default AnimatedTitle;
