import Image from "next/image";
import { CTA } from "@/components/common/CTA";
import type { CTA as CTAData, ImageAsset } from "@/types/content";
export function PageHeroSection({ title, description, image, cta, draft = false }: { title: string; description: string; image?: ImageAsset; cta?: CTAData; draft?: boolean }) {
  return <header className="page-hero">{draft && <p className="eyebrow">Development preview · Content awaiting approval</p>}<h1>{title}</h1><p className="hero-description">{description}</p>{cta && <CTA {...cta} />}{image && <Image {...image} alt={image.alt} className="hero-image" sizes="(max-width: 768px) 100vw, 1100px" priority />}</header>;
}

