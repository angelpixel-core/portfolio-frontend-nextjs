import "./styles.css";

import { Suspense } from "react";
import { ParagraphText } from "@/atoms/texts";
import { BiographySkeleton } from "./skeletons";
import { useProfile } from "@/hooks";

const Biography = () => {
  const { data: profile = [] } = useProfile({ id: 1 });

  return (
    <>
      <h2 className="biography-title">biography</h2>

      <Suspense fallback={<BiographySkeleton />}>
        {profile.biography.map((row, idx) => (
          <ParagraphText key={idx} text={row} />
        ))}
      </Suspense>
    </>
  );
};

export default Biography;
