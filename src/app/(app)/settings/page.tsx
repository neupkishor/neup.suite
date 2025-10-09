
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Palette, Bell, ShieldAlert, UserCircle } from "lucide-react";
import Link from "next/link";

const settingsItems = [
    { name: "Account", href: "/settings/account", icon: UserCircle, description: "Manage your personal information and preferences." },
    { name: "Branding", href: "/settings/branding", icon: Palette, description: "Customize the portal with your own branding." },
    { name: "Notifications", href: "/settings/notifications", icon: Bell, description: "Configure how you receive alerts and updates." },
    { name: "Error Log", href: "/settings/errors", icon: ShieldAlert, description: "View a log of application errors for debugging." },
];

function SettingsItemCard({ item }: { item: typeof settingsItems[0] }) {
    return (
        <Link href={item.href}>
            <Card className="group hover:border-primary transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <item.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
            </Card>
        </Link>
    )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <CardHeader className="p-0">
            <CardTitle className="font-headline text-2xl">Settings</CardTitle>
            <CardDescription>Manage your account, branding, and notification preferences.</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4">
            {settingsItems.map((item) => (
                <SettingsItemCard key={item.href} item={item} />
            ))}
        </div>
    </div>
  );
}
