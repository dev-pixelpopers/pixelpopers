import Image from "next/image";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import { owners } from "@/lib/site-content";
import { authorBios, formatDate, slugify, type Post } from "@/lib/pages/blog";
import PostCard from "./PostCard";
import PostCover from "./PostCover";

const ownerOf = (name: string) => owners.find((o) => o.name === name);

/** Breadcrumb, centred Nevera title, author/date row and the cover with the read-time sticker. */
export function PostHero({ post }: { post: Post }) {
  const owner = ownerOf(post.author);
  return (
    <header className="relative isolate">
      {/* Decorative glow bleeding up behind the site header, so it can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(30rem,45vw,54rem)] bg-[radial-gradient(ellipse_27%_40%_at_50%_10%,rgb(242_119_147/0.35),transparent_75%)]"
      />
      <div className="shell flex justify-center pt-[clamp(1.5rem,3.125vw,3.75rem)]">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.category },
          ]}
        />
      </div>
      <div className="shell mt-[clamp(1.25rem,2.08vw,2.5rem)]">
        <h1
          data-reveal
          className="mx-auto max-w-[87.5rem] text-center font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.15] text-grape uppercase"
        >
          {post.title}
        </h1>
        <div
          data-reveal
          className="mt-[clamp(1.5rem,2.3vw,2.75rem)] flex items-center justify-center gap-3.5"
        >
          {owner ? (
            <Image
              src={owner.avatar}
              alt=""
              width={56}
              height={56}
              className="size-[clamp(2.75rem,2.9vw,3.5rem)] shrink-0 rounded-full bg-lagoon object-cover"
            />
          ) : null}
          <p className="flex flex-col gap-1.5">
            <span className="font-copy text-[clamp(0.9375rem,0.9375vw,1.125rem)] leading-tight font-bold text-ink">
              {post.author}
              <span className="font-bold"> · </span>
              <span className="font-bold">{owner?.role}</span>
            </span>
            <span className="font-copy text-micro text-ink/60">
              <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
              {post.readTime} min read
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-[clamp(2rem,4.4vw,5.25rem)] grid max-w-[1920px] px-[clamp(1.25rem,6.25vw,7.5rem)]">
        <PostCover
          cover={post.cover}
          contain
          priority
          sizes="(min-width: 1920px) 1680px, 92vw"
          className="col-start-1 row-start-1 aspect-[4/3] rounded-[clamp(1.5rem,2.5vw,3rem)] shadow-[0_24px_60px_rgb(34_1_40/0.18)] sm:aspect-[1680/820]"
        />
        <p
          aria-hidden
          className="col-start-1 row-start-1 -mt-[4.76%] -mr-[1.8%] grid aspect-square w-[clamp(5.5rem,11.46vw,13.75rem)] -rotate-10 place-items-center self-start justify-self-end rounded-full bg-sunbeam text-center font-display text-[clamp(0.875rem,1.77vw,2.125rem)] leading-[1.29] text-ink uppercase"
        >
          {post.readTime}
          <br />
          min
          <br />
          read
        </p>
      </div>
    </header>
  );
}

/** Tag pills under the article. */
export function PostTags({ tags }: { tags: string[] }) {
  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2.5">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full bg-white px-4 py-2 font-copy text-sm leading-none font-bold text-grape"
        >
          #{t.replace(/\s+/g, "")}
        </li>
      ))}
    </ul>
  );
}

/** Figma "Author card" (grape, giant Modak P) plus the long-form author bio paragraph. */
export function AuthorCard({ author }: { author: Post["author"] }) {
  const owner = ownerOf(author);
  const bio = authorBios[author];
  return (
    <section
      aria-labelledby="author-title"
      className="flex flex-col gap-[clamp(1.25rem,1.67vw,2rem)]"
    >
      <div className="grid overflow-hidden rounded-[1.75rem] bg-grape">
        {/* Giant letter shares the card's grid cell and is clipped by it. */}
        <span
          aria-hidden
          className="col-start-1 row-start-1 -my-[clamp(3rem,6.25vw,7.5rem)] mr-[12%] self-center justify-self-end font-pop text-[clamp(14rem,21.9vw,26.25rem)] leading-none text-white/12 select-none"
        >
          P
        </span>
        <div className="col-start-1 row-start-1 flex flex-col gap-5 p-[clamp(1.5rem,2.08vw,2.5rem)] sm:flex-row sm:items-center sm:gap-[clamp(1.25rem,1.04vw,1.25rem)]">
          {owner ? (
            <Image
              src={owner.avatar}
              alt={`Portrait of ${author}`}
              width={110}
              height={110}
              className="size-[clamp(5rem,5.73vw,6.875rem)] shrink-0 rounded-full border-[3px] border-sunbeam bg-blush object-cover"
            />
          ) : null}
          <div className="flex flex-col">
            <p className="font-display text-[0.875rem] text-sunbeam uppercase">
              Written by
            </p>
            <h2
              id="author-title"
              className="mt-1.5 font-display text-[clamp(1.5rem,1.67vw,2rem)] leading-tight text-white uppercase"
            >
              {author}
            </h2>
            <p className="mt-2 max-w-[31.25rem] font-copy text-[clamp(0.9375rem,0.9375vw,1.125rem)] leading-[1.56] font-light text-white/85">
              {bio.short}
            </p>
          </div>
        </div>
      </div>
      <p className="font-copy text-[clamp(1.0625rem,1.146vw,1.375rem)] leading-[1.73] font-light text-ink">
        {bio.long}
      </p>
    </section>
  );
}

/** "KEEP READING / MORE IDEAS WORTH POPPING" + three related cards. */
export function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section aria-labelledby="related-title" className="flex flex-col">
      <div className="shell">
        <SectionTitle
          eyebrow="Keep reading"
          title={<span id="related-title">More ideas worth popping</span>}
        />
      </div>
      <ul
        data-reveal-stagger
        className="mx-auto mt-[clamp(2rem,3.96vw,4.75rem)] grid w-full max-w-[1920px] gap-x-[clamp(1rem,2.08vw,2.5rem)] gap-y-8 px-[clamp(1.25rem,6.25vw,7.5rem)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function tocItems(post: Post) {
  return post.body.flatMap((b) =>
    b.type === "h2" ? [{ id: slugify(b.text), label: b.text }] : [],
  );
}
