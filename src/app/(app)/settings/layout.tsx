
'use client';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/settings"><ArrowLeft /></Link>
                </Button>
                <div>
                    <h2 className="font-headline text-2xl font-semibold">Settings</h2>
                    <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
                </div>
            </div>
            <div className="max-w-4xl">
                {children}
            </div>
        </div>
    )
}
