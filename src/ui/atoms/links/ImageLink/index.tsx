import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * ImageLink - Clickable image that links to a URL
 *
 * Uses display:block on Link to prevent baseline gap issues
 * and match the skeleton placeholder dimensions exactly.
 *
 * @param {string} sizes - Responsive sizes hint for Next.js Image optimization
 *                         Defaults to the width if not provided
 */

interface ImageLinkProps {
  href: string;
  src: string;
  alt: string;
  size: number;
  className?: string;
  sizes?: string;
  target?: string;
  rel?: string;
}

const ImageLink = ({
  href,
  src,
  alt,
  size,
  className,
  sizes,
  target,
  rel,
}: ImageLinkProps): React.JSX.Element => {
  return (
    <Link href={href} className="block" target={target} rel={rel}>
      <Image
        src={src}
        alt={alt}
        priority={true}
        width={size}
        height={size}
        sizes={sizes || `${size}px`}
        className={className}
      />
    </Link>
  );
};

export default ImageLink;
