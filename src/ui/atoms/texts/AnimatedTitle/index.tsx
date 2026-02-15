import React from "react";

import "./styles.css";

import Title from "./Title";

interface AnimatedTitleProps {
  className?: string;
}

const AnimatedTitle = ({
  className = "",
}: AnimatedTitleProps): React.JSX.Element => {
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
