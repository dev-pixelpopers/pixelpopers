import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

/**
 * The Figma lockup stacks a black-tinted "PIXEL" wordmark over the full-colour
 * logo so the top word reads dark on the cream background. Both layers are
 * unmodified Figma exports; they are stacked with a single-cell CSS grid
 * instead of absolute positioning.
 */
export default function BrandLogo({
  className = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={`grid w-[clamp(7rem,9.9vw,11.875rem)] ${className}`}>
      <Image
        src="/assets/logo-pixelpopers.png"
        alt="Pixel Popers"
        width={190}
        height={84}
        priority={priority}
        className="col-start-1 row-start-1 h-auto w-full"
      />
      <span
        aria-hidden
        className="col-start-1 row-start-1 h-full w-full bg-black"
        style={{
          maskImage: "url(/assets/logo-wordmark-mask.png)",
          maskSize: "60.81% 38.37%",
          maskPosition: "74.03% 23.82%",
          maskRepeat: "no-repeat",
        }}
      />
    </span>
  );
}
