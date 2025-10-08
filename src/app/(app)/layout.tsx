
import type { ReactNode } from "react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FirebaseClientProvider } from "@/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";

function AppSidebar() {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r bg-card">
        <ScrollArea className="h-full w-full">
            <div className="p-4">
                <MainNav />
            </div>
        </ScrollArea>
    </aside>
  )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm shadow-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <Link href="/home">
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
            </div>
        </div>
      </header>
      <div className="flex-1">
        <div className="mx-auto flex max-w-[1440px]">
            <AppSidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
    </FirebaseClientProvider>
  );
}
