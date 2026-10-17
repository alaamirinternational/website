import { turkey } from "./turkey";
import { azerbaijan } from "./azerbaijan";
import { malaysia } from "./malaysia";
import { country4 } from "./country-4";
import { country5 } from "./country-5";
export const destinations = [turkey, azerbaijan, malaysia, country4, country5];
export function getDestinationBySlug(slug: string) { return destinations.find(item => item.slug === slug); }
