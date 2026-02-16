import React from "react";

type MicrosoftIconProps = React.SVGAttributes<SVGSVGElement>;

const MicrosoftIcon = ({ ...rest }: MicrosoftIconProps): React.JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26px"
      height="26px"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <rect x="17" y="17" width="10" height="10" fill="#FEBA08" />
      <rect x="5" y="17" width="10" height="10" fill="#05A6F0" />
      <rect x="17" y="5" width="10" height="10" fill="#80BC06" />
      <rect x="5" y="5" width="10" height="10" fill="#F25325" />
    </svg>
  );
};

export default MicrosoftIcon;
