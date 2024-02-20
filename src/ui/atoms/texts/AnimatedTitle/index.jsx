import "./styles.css";

import { Title } from "./Title";

export function AnimatedTitle({ className = "" }) {
  return (
    <div className="animated-title_container">
      <Title className={className} />
    </div>
  );
}
