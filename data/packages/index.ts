import { umrahPackages } from "./umrah";
import { hajjPackages } from "./hajj";
import { pakistanPackages } from "./pakistan";
import { destinations } from "@/data/destinations";
import type { PackageKind } from "@/types/content";
export const packages = [...umrahPackages, ...hajjPackages, ...pakistanPackages, ...destinations.flatMap(item => item.packages)];
export function getPackage(kind: PackageKind, slug: string, country?: string) { return packages.find(item => item.kind === kind && item.slug === slug && item.country === country); }
