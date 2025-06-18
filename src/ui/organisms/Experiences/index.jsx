import "./styles.css";

import { Suspense } from "react";

import { History } from "@/atoms/hocs";
import { ExperienceList } from "./ExperienceList";
import Skeleton from "./skeleton";

export function Experiences() {
  return (
    <div className="experiences-container">
      <h2 className="experiences-title">Experiences</h2>

      <History>
        <Suspense fallback={<Skeleton />}>
          <ExperienceList />
        </Suspense>
      </History>
    </div>
  );
}
