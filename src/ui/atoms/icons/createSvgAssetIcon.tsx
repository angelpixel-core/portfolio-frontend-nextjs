import type { JSX } from "react";

type SvgAsset = { src: string } | string;

const resolveAssetSrc = (asset: SvgAsset): string =>
  typeof asset === "string" ? asset : asset.src;

const createSvgAssetIcon = (asset: SvgAsset) => {
  const src = resolveAssetSrc(asset);

  const SvgAssetIcon = (): JSX.Element => (
    <image
      href={src}
      width="128"
      height="128"
      preserveAspectRatio="xMidYMid meet"
    />
  );

  return SvgAssetIcon;
};

export default createSvgAssetIcon;
