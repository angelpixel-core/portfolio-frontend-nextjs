import "./styles.css";

import LiSkeleton from "@/atoms/icons/LiIcon/skeleton";

export default function Skeleton({ data, children }) {
  return (
    <li className="transitioner-li">
      <LiSkeleton />

      <div>
        {children}

        <p className="transitioner-li_legend">{data}</p>
      </div>
    </li>
  );
}
