import React from "react";

interface ClipIconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

const ClipIcon = ({
  className = "",
  ...rest
}: ClipIconProps): React.JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...rest}
      className={`w-full h-auto ${className}`}
    >
      <path
        d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.19 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.49"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClipIcon;
