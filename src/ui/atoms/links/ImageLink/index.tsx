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
const ImageLink = ({ href, src, alt, size, className, sizes }) => {
  return (
    <Link href={href} className="block">
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
