
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMainSettingsPage = pathname === '/settings';

    return (
        <div className="space-y-6">
             {!isMainSettingsPage && (
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/settings"><ArrowLeft /></Link>
                    </Button>
                </div>
             )}
            <div className="max-w-4xl">
                {children}
            </div>
        </div>
    )
}
