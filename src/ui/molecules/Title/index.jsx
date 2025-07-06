import { Suspense } from "react";
import Skeleton from "@/atoms/texts/AnimatedTitle/skeleton";

import { AnimatedTitle } from "@/atoms/texts";

const Title = ({ className }) => {
  return (
    <div className="animated-title_container">
      <Suspense fallback={<Skeleton />}>
        <AnimatedTitle className={className} />
      </Suspense>
    </div>
  );
};

export default Title;
