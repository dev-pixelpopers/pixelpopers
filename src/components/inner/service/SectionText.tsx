/** A design section's optional description from the CMS (Page sections → Description); nothing when empty. */
export default function SectionText({ text, center = false, className = "" }: { text: string; center?: boolean; className?: string }) {
  if (!text.trim()) return null;
  return (
    <p
      data-reveal
      className={`mt-[clamp(1.25rem,1.67vw,2rem)] max-w-[56rem] font-copy text-body leading-[1.64] font-light whitespace-pre-line text-ink/85 ${center ? "mx-auto text-center" : ""} ${className}`}
    >
      {text}
    </p>
  );
}
