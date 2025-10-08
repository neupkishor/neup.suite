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
  CheckSquare,
  FlaskConical,
  Beaker,
  BookOpen,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/communication", icon: MessageSquare, label: "Inbox" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/billing", icon: Receipt, label: "Billing" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
];

const manageLinks = [
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/clients", icon: Briefcase, label: "Clients" },
  { href: "/team", icon: Users, label: "Team" },
];

const researchLinks = [
  { href: "/knowledge", icon: BookOpen, label: "Knowledge" },
  { href: "/testings", icon: Beaker, label: "Testings" },
  { href: "/experiments", icon: FlaskConical, label: "Experiments" },
];

const rootLinks = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};


export function MainNav() {
  return (
    <nav className="flex flex-col gap-4">
      <div>
         <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Main</h3>
         <div className="flex flex-col gap-1 mt-1">
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
      <div>
         <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Manage</h3>
        <div className="flex flex-col gap-1 mt-1">
          {manageLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
      <div>
         <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Research</h3>
        <div className="flex flex-col gap-1 mt-1">
          {researchLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
      <div>
         <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Root</h3>
        <div className="flex flex-col gap-1 mt-1">
          {rootLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
    </nav>
  );
}
