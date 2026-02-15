import React from "react";

import "./styles.css";

import { Suspense } from "react";

import { default as Skeleton } from "./skeleton";
import { default as Text } from "./Text";

interface CopyrightProps {
  children?: React.ReactNode;
}

const Copyright = ({ children }: CopyrightProps): React.JSX.Element => {
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
