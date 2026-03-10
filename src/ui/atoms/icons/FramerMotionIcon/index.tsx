import React from "react";

interface FramerMotionIconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

const FramerMotionIcon = ({
  className = "",
  ...rest
}: FramerMotionIconProps): React.JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        fill="#FEF62A"
        d="M0 6C0 2.686 2.686 0 6 0h23c3.314 0 6 2.686 6 6v23c0 3.314-2.686 6-6 6H6c-3.314 0-6-2.686-6-6V6Z"
      />
      <path
        fill="#0C1012"
        d="M14.587 13 9.57 22H5l3.917-7.028c.607-1.089 2.122-1.972 3.384-1.972Zm11.207 2.25A2.25 2.25 0 0 1 28.079 13a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1-2.285-2.25ZM15.443 13h4.57l-5.016 9h-4.57Zm5.398 0h4.57l-3.917 7.028C20.887 21.117 19.372 22 18.11 22h-2.285Z"
      />
    </svg>
  );
};

export default FramerMotionIcon;
