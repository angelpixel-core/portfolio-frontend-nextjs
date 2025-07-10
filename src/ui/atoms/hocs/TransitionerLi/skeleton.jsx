import "./styles.css";

import { Skeleton as LiIconSkeleton } from "@/atoms/icons/LiIcon/skeleton";

export const Skeleton = ({ data, children }) => {
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
