import "./styles.css";

import Title from "./Title";

const AnimatedTitle = ({ className = "" }) => {
  return (
    <div
      className="animated-title_container"
      data-testid="profile-title-container"
    >
      <Title className={className} />
    </div>
  );
};

export default AnimatedTitle;
