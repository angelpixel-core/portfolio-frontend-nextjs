import Link from "next/link";
import Image from "next/image";

const ImageLink = ({ href, src, alt, size, className }) => {
  return (
    <Link href={href}>
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
