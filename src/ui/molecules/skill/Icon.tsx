"use client";

import { useEffect, useState, type ComponentType } from "react";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const [IconComponent, setIconComponent] = useState<ComponentType | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    const componentKey = `${name}Icon`;

    import(`../../atoms/icons/${componentKey}`)
      .then((mod) => {
        if (!cancelled) setIconComponent(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) setIconComponent(null);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!IconComponent) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4rem"
      height="4rem"
      viewBox="-25 -25 180 180"
      className={className}
      aria-hidden="true"
    >
      <IconComponent />
    </svg>
  );
}
