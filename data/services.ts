import type { Service } from "@/types/content";
export const services: Service[] = [
  { slug: "umrah", title: "Umrah", description: "Explore Umrah package information.", href: "/umrah" },
  { slug: "hajj", title: "Hajj", description: "Explore Hajj package information.", href: "/hajj" },
  { slug: "international", title: "International Tours", description: "Browse international destinations.", href: "/international-tours" },
  { slug: "pakistan", title: "Pakistan Tours", description: "Explore travel within Pakistan.", href: "/pakistan-tours" },
  { slug: "visa-assistance", title: "Visa Assistance", description: "Discuss documentation and visa support requirements.", href: "/services/visa-assistance" },
  { slug: "air-ticketing", title: "Air Ticketing", description: "Discuss routes and flight requirements.", href: "/services/air-ticketing" },
  { slug: "hotels-accommodation", title: "Hotels & Accommodation", description: "Discuss location, room and stay requirements.", href: "/services/hotels-accommodation" },
  { slug: "transport", title: "Transport", description: "Discuss transfers and group transport needs.", href: "/services/transport" },
  { slug: "corporate-travel", title: "Corporate Travel", description: "Discuss travel requirements for your organisation.", href: "/services/corporate-travel" },
];
