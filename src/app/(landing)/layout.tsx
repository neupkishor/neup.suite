
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto flex h-16 max-w-[1440px] items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/home">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/home">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center">{children}</main>
      <footer className="bg-muted w-full">
        <div className="container mx-auto max-w-[1440px] py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold mb-2">Product</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Resources</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Support</Link></li>
                        <li><Link href="#" className="hover:text-foreground">API Docs</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
             <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Neup.Suite. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
