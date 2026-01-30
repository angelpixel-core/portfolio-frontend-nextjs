import Link from "next/link";
import Image from "next/image";

/**
 * ImageLink - Clickable image that links to a URL
 *
 * Uses display:block on Link to prevent baseline gap issues
 * and match the skeleton placeholder dimensions exactly.
 */
const ImageLink = ({ href, src, alt, size, className }) => {
  return (
    <Link href={href} className="block">
      <Image
        src={src}
        alt={alt}
        priority={true}
        width={size}
        height={size}
        className={className}
      />
    </Link>
  );
};

export default ImageLink;
