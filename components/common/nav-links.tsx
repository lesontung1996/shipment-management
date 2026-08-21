"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Shipments" },
  { href: "/assignments", label: "Assignments" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-md px-2.5 py-1.5 transition-colors",
            isActive(href)
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
