import "./styles.css";

import { Suspense } from "react";

import { default as Skeleton } from "./skeleton";
import { default as Text } from "./Text";

const Copyright = ({ children }) => {
  return (
    <span className="copyright_year">
      <Suspense fallback={<Skeleton />}>
        <Text />
      </Suspense>
      {children} &copy; All Rights Reserved.
    </span>
  );
};

export default Copyright;
