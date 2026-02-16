import React from "react";

interface QuestionIconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

const QuestionIcon = ({
  className = "",
  ...rest
}: QuestionIconProps): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18h.01M12 6v6m0 0v0m0 0h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
    />
  </svg>
);

export default QuestionIcon;
