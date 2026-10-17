import Image from "next/image";
import { Section, ContentPending } from "./Section";
import type { ImageAsset } from "@/types/content";
export function GallerySection({ title = "Gallery", images }: { title?: string; images: ImageAsset[] }) {
  return <Section id="gallery" title={title}>{images.length ? <div className="grid-cards">{images.map(image => <Image key={image.src} {...image} alt={image.alt} sizes="(max-width: 768px) 100vw, 33vw" />)}</div> : <ContentPending subject="owned or licensed images with descriptive alt text" />}</Section>;
}

