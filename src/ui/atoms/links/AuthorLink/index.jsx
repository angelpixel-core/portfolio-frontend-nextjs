import "./styles.css";

import { BaseLink } from "@/atoms/links/_index";

export const AuthorLink = ({ href, text, className = "" }) => {
  return (
    <span className="author-link_container">
      {/*Build With<span className="author-llnk_heart-icon">&#9825;</span>*/}
      by &nbsp;
      <BaseLink
        href={href}
        text={text}
        className={`author-link ${className}`}
      />
    </span>
  );
};
