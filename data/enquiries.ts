export const enquiryTypes = ["Umrah", "Hajj", "International Tour", "Pakistan Tour", "Visa", "Corporate Travel", "Air Ticketing", "Other"] as const;
export type EnquiryType = (typeof enquiryTypes)[number];
export function getEnquiryType(value?: string): EnquiryType { return enquiryTypes.find(type => type === value) ?? "Other"; }
