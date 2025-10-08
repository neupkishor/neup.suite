"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import NProgress from 'nprogress';
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
  Contact,
  Target,
  BarChart,
  MessageCircle,
  Megaphone,
} from "lucide-react";

const mainLinks = [
  { href: "/home", icon: LayoutDashboard, label: "Home" },
  { href: "/clients", icon: Briefcase, label: "Clients" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/billing", icon: Receipt, label: "Billing" },
  { href: "/support", icon: LifeBuoy, label: "Support" },
];

const manageLinks = [
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/contacts", icon: Contact, label: "Contacts" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/goals", icon: Target, label: "Goals" },
];

const researchLinks = [
  { href: "/knowledge", icon: BookOpen, label: "Knowledge" },
  { href: "/experiments", icon: FlaskConical, label: "Experiments" },
  { href: "/reports", icon: BarChart, label: "Reports" },
];

const clientLinks = [
  { href: "/feedback", icon: Megaphone, label: "Feedback" },
  { href: "/discussions", icon: MessageCircle, label: "Discussions" },
];

const rootLinks = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) {
      NProgress.start();
    }
  };
  
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-in-out hover:bg-muted hover:text-foreground",
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
         <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Client</h3>
        <div className="flex flex-col gap-1 mt-1">
          {clientLinks.map((link) => (
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
