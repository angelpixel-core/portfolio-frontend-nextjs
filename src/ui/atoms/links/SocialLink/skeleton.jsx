import "./styles.css";

export const SocialLinkSkeleton = ({ className = "" }) => {
  return (
    <span className={`${className} social-option_title`}>
      <div className="inline-block w-4 h-4 bg-yellow-300" />
    </span>
  );
};
