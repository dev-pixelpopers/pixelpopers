/**
 * The optional subheading under a service page's headline (Services →
 * (service) → Basics → "Subheading"). An <h2>, so it adds a second line of
 * keywords to the page's outline; nothing is rendered when it's empty. It
 * takes the hero's own text colour, so it reads on light and dark heroes.
 */
export default function HeroSubheading({ text, className = "" }: { text?: string | null; className?: string }) {
  const value = text?.trim();
  if (!value) return null;
  return (
    <h2 className={`mt-[clamp(0.75rem,1.15vw,1.375rem)] max-w-[38rem] font-haas text-[clamp(1.125rem,1.56vw,1.875rem)] leading-[1.3] font-medium ${className}`}>
      {value}
    </h2>
  );
}
