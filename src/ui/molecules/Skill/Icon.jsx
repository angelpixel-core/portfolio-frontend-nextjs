import * as Icons from "@/atoms/icons/_index";

export function Icon({ name, className = "" }) {
  const componentKey = `${name}Icon`;
  const IconComponent = Icons[componentKey];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4rem"
      height="4rem"
      viewBox="-25 -25 180 180"
      className={className}
    >
      <IconComponent />;
    </svg>
  );
}
