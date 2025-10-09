
'use client';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Account", href: "/settings" },
    { name: "Branding", href: "/settings/branding" },
    { name: "Notifications", href: "/settings/notifications" },
    { name: "Error Log", href: "/settings/errors" },
];

function SettingsNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted/50"
                    )}
                 >
                    {item.name}
                 </Link>
            ))}
        </nav>
    );
}


export default function SettingsLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="space-y-6">
             <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl">Settings</CardTitle>
                <CardDescription>Manage your account, branding, and notification preferences.</CardDescription>
            </CardHeader>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNav />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    )
}
