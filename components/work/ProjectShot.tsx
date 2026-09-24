import Image from "next/image";
import type { ProjectImage } from "@/content/projects";

/** A product screenshot in a light browser frame. */
export function ProjectShot({
  image,
  priority = false,
}: {
  image: ProjectImage;
  priority?: boolean;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-line bg-paper-deep shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2" aria-hidden>
          <span className="size-2 rounded-full bg-muted-mark" />
          <span className="size-2 rounded-full bg-muted-mark" />
          <span className="size-2 rounded-full bg-muted-mark" />
        </div>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 576px, 100vw"
          className="block h-auto w-full"
          priority={priority}
        />
      </div>
      <figcaption className="mt-2 text-xs text-ink-muted">{image.caption}</figcaption>
    </figure>
  );
}
