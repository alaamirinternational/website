import Link from "next/link";
import { navigation } from "@/data/navigation";
export function Header() {
  return <header className="site-header"><div className="shell header-inner"><Link className="brand" href="/">AlAamir <span>International</span></Link><nav aria-label="Main navigation"><ul className="nav-list">{navigation.map(item => <li key={item.label}>{item.children ? <details className="nav-group"><summary>{item.label}</summary><ul className="submenu"><li><Link href={item.href}>{item.label} overview</Link></li>{item.children.map(child => <li key={child.label}><Link href={child.href}>{child.label}</Link></li>)}</ul></details> : <Link href={item.href}>{item.label}</Link>}</li>)}</ul></nav></div></header>;
}
