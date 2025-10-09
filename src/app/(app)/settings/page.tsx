
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Palette, Bell, ShieldAlert, UserCircle } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import NProgress from 'nprogress';
import { usePathname } from "next/navigation";

const settingsItems = [
    { name: "Account", href: "/settings/account", icon: UserCircle, description: "Manage your personal information and preferences." },
    { name: "Branding", href: "/settings/branding", icon: Palette, description: "Customize the portal with your own branding." },
    { name: "Notifications", href: "/settings/notifications", icon: Bell, description: "Configure how you receive alerts and updates." },
    { name: "Error Log", href: "/settings/errors", icon: ShieldAlert, description: "View a log of application errors for debugging." },
];

function SettingsListItem({ item, isLast }: { item: typeof settingsItems[0], isLast: boolean }) {
    const pathname = usePathname();
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname !== item.href) {
            NProgress.configure({ showSpinner: false });
            NProgress.start();
        }
    };

    return (
        <>
            <Link href={item.href} className="group block" onClick={handleClick}>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-4">
                        <item.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
            </Link>
            {!isLast && <Separator />}
        </>
    )
}

export default function SettingsPage() {
  return (
    <Card>
        <CardContent className="p-0">
            {settingsItems.map((item, index) => (
                <SettingsListItem key={item.href} item={item} isLast={index === settingsItems.length - 1} />
            ))}
        </CardContent>
    </Card>
  );
}
