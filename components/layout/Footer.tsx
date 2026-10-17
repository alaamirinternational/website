import Link from "next/link";
import { site } from "@/config/site";
import { contactDetails } from "@/data/company";
export function Footer() {
  return <footer className="site-footer"><div className="shell"><p className="brand">{site.name}</p><nav aria-label="Footer navigation" className="footer-links"><Link href="/about">About</Link><Link href="/team">Team & Guides</Link><Link href="/career">Career</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms & Conditions</Link><Link href="/booking-cancellation-policy">Booking & Cancellation Policy</Link></nav>{contactDetails.email && <p><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></p>}{contactDetails.phone && <p><a href={`tel:${contactDetails.phone}`}>{contactDetails.phone}</a></p>}{contactDetails.address && <address>{contactDetails.address}</address>}<p className="small">Development foundation · Content and contact channels awaiting approval.</p></div></footer>;
}
