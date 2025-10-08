"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Receipt,
  LifeBuoy,
  Settings,
  FolderKanban,
} from "lucide-react";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/communication", icon: MessageSquare, label: "Inbox" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/billing", icon: Receipt, label: "Billing" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/clients", icon: Briefcase, label: "Clients" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={`/dashboard${link.href === '/dashboard' ? '' : link.href}`}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            (pathname === `/dashboard${link.href === '/dashboard' ? '' : link.href}` || (pathname.startsWith(`/dashboard${link.href}`) && link.href !== '/dashboard')) &&
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
