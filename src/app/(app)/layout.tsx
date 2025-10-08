import type { ReactNode } from "react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AppSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card p-4">
        <div className="mb-8">
          <Logo />
        </div>
        <MainNav />
    </aside>
  )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
                <Link href="/dashboard">
                    <Logo />
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <form className="relative ml-auto hidden sm:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    />
                </form>
                <UserNav />
                <Button className="hidden md:flex">Contact Us</Button>
            </div>
        </div>
      </header>
      <div className="flex-1">
        <div className="mx-auto flex max-w-7xl">
            <AppSidebar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
