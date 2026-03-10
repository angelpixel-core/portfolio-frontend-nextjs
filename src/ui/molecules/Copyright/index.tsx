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
    <span className="copyright__year">
      <Suspense fallback={<Skeleton />}>
        <Text />
      </Suspense>
      {children} &copy; Angel Szymczak
    </span>
  );
};

export default Copyright;
