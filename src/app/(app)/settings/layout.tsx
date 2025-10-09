
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
    { name: "Account", href: "/settings" },
    { name: "Branding", href: "/settings/branding" },
    { name: "Notifications", href: "/settings/notifications" },
    { name: "Error Log", href: "/settings/errors" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const currentTab = tabs.find(tab => tab.href === pathname)?.href || "/settings";

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Settings</CardTitle>
                <CardDescription>Manage your account, branding, and notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <Tabs value={currentTab} className="w-full" onValueChange={(value) => router.push(value)}>
                    <TabsList className="grid w-full grid-cols-4">
                        {tabs.map((tab) => (
                             <TabsTrigger key={tab.href} value={tab.href}>{tab.name}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                {children}
            </CardContent>
        </Card>
    )
}
