"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/habits', label: 'Habits' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className="logo" style={{ textDecoration: 'none' }}>✿</Link>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`pill ${pathname === l.href ? 'on' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
