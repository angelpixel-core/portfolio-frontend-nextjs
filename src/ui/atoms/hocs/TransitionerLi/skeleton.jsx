import "./styles.css";

import { LiIconSkeleton } from "@/atoms/icons/_index";

export const TransitionerLiSkeleton = ({ data, children }) => {
  return (
    <li className="transitioner-li">
      <LiIconSkeleton />

      <div>
        {children}

        <p className="transitioner-li_legend">{data}</p>
      </div>
    </li>
  );
};
