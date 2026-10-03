import BrandLogo from "@/components/ui/BrandLogo";
import PopButton from "@/components/ui/PopButton";

export default function SiteHeader() {
  return (
    <header className="shell relative z-20 flex items-center justify-between gap-4 py-6 md:py-10">
      <a
        // href="#services"
        className="font-display text-nav text-blush uppercase transition-colors hover:text-grape"
      >
        Menu
      </a>

      <a href="/" aria-label="Pixel Popers — home">
        <BrandLogo priority />
      </a>

      <PopButton href="#contact" label="Lets Talk" size="sm" />
    </header>
  );
}
