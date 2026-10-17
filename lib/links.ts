import type { Package } from "@/types/content";
export function packagePath(item: Package): string {
  if (item.kind === "international") {
    if (!item.country) throw new Error("International packages require a country slug");
    return `/international-tours/${item.country}/${item.slug}`;
  }
  return item.kind === "pakistan" ? `/pakistan-tours/${item.slug}` : `/${item.kind}/packages/${item.slug}`;
}
export function whatsappHref(phone: string | undefined, message: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[\s+()-]/g, "");
  if (!/^[1-9]\d{7,14}$/.test(digits)) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
