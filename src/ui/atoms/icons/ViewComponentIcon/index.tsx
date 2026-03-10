import React from "react";

interface ViewComponentIconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

const ViewComponentIcon = ({
  className = "",
  ...rest
}: ViewComponentIconProps): React.JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 84"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        fill="#DF3730"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.481 0c-.763 0-1.245.821-.873 1.487L70.812 41.27a1.5 1.5 0 0 1 0 1.462L48.608 82.513c-.372.666.11 1.487.873 1.487h22.416a1.5 1.5 0 0 0 1.31-.769l22.605-40.5a1.5 1.5 0 0 0 0-1.462L73.207.77A1.5 1.5 0 0 0 71.897 0H49.481Zm-2.107 41.269a1.5 1.5 0 0 1 0 1.462l-22.72 40.705c-.38.684-1.363.684-1.744 0L.19 42.731a1.5 1.5 0 0 1 0-1.462L22.909.564c.381-.683 1.364-.683 1.746 0l22.719 40.705Z"
      />
    </svg>
  );
};

export default ViewComponentIcon;
