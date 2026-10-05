import Link from "next/link";
import { formatDate, type Post } from "@/lib/pages/blog";
import PostCover from "./PostCover";
import { cardShadow } from "./tones";

type Props = {
  post: Post;
  /** `full` = blog grid card (meta + excerpt), `compact` = "Keep reading" card. */
  variant?: "full" | "compact";
  headingLevel?: "h2" | "h3";
};

/** Figma "Post card — …" (540×640) and "Related — …" (540×560). */
export default function PostCard({
  post,
  variant = "full",
  headingLevel: H = "h3",
}: Props) {
  const full = variant === "full";
  return (
    <article
      className={`group h-full overflow-hidden rounded-[clamp(1.25rem,1.46vw,1.75rem)] bg-white transition-transform duration-300 hover:-translate-y-1.5 ${cardShadow}`}
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="grid">
          <PostCover
            cover={post.cover}
            sizes="(min-width: 1920px) 540px, (min-width: 768px) 30vw, 100vw"
            className={`col-start-1 row-start-1 ${full ? "aspect-[540/340]" : "aspect-[540/320]"}`}
          />
          <span className="col-start-1 row-start-1 m-[clamp(0.875rem,1.25vw,1.5rem)] self-start justify-self-start rounded-2xl bg-white px-3.5 py-1.5 font-haas text-[clamp(0.6875rem,0.68vw,0.8125rem)] leading-none text-ink uppercase">
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-[clamp(1.25rem,1.67vw,2rem)] pt-[clamp(1.25rem,1.67vw,2rem)] pb-[clamp(1.5rem,2.6vw,3.125rem)]">
          {full ? (
            <p className="font-haas text-[clamp(0.75rem,0.73vw,0.875rem)] leading-none text-ink/60 uppercase">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden> · </span>
              {post.readTime} min
            </p>
          ) : null}
          <H
            className={`font-haas text-[clamp(1.25rem,1.5625vw,1.875rem)] leading-[1.27] text-ink ${full ? "mt-[clamp(0.875rem,1.15vw,1.375rem)]" : ""}`}
          >
            <span className="transition-colors group-hover:text-grape">
              {post.title}
            </span>
          </H>
          {full ? (
            <p className="mt-3.5 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.47] font-light text-ink/80">
              {post.excerpt}
            </p>
          ) : null}
          <span
            aria-hidden
            className="mt-auto pt-6 font-display text-micro text-blush uppercase"
          >
            Read more →
          </span>
        </div>
      </Link>
    </article>
  );
}
