import type { NavigationItem } from "@/types/content";
import { destinations } from "@/data/destinations";
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Umrah", href: "/umrah", children: [{ label: "Umrah Packages", href: "/umrah/packages" }, { label: "Free Umrah Class", href: "/umrah/free-class" }, { label: "Umrah Guides", href: "/umrah/guides" }] },
  { label: "Hajj", href: "/hajj", children: [{ label: "Hajj Packages", href: "/hajj/packages" }] },
  { label: "Tours", href: "/international-tours", children: [{ label: "International Tours", href: "/international-tours" }, ...destinations.map(destination => ({ label: destination.name, href: `/international-tours/${destination.slug}` })), { label: "Pakistan Tours", href: "/pakistan-tours" }] },
  { label: "Services", href: "/services", children: [{ label: "Visa Assistance", href: "/services/visa-assistance" }, { label: "Corporate Travel", href: "/services/corporate-travel" }, { label: "Air Ticketing", href: "/services/air-ticketing" }, { label: "Hotels & Accommodation", href: "/services/hotels-accommodation" }, { label: "Transport", href: "/services/transport" }] },
  { label: "Resources", href: "/guides", children: [{ label: "Umrah Guides", href: "/umrah/guides" }, { label: "Travel Guides / Blog", href: "/guides" }] },
  { label: "About", href: "/about", children: [{ label: "About AlAamir", href: "/about" }, { label: "Team & Guides", href: "/team" }, { label: "Career", href: "/career" }] },
  { label: "Contact", href: "/contact" },
];
