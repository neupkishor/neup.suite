"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImages } from "@/lib/placeholder-images";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth/sign-out";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function UserNav() {
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
  const [user, setUser] = useState<{account_id: string, display_name: string} | null>(null);

  useEffect(() => {
    // Check authentication cookies on the client side
    const accountId = Cookies.get('auth_account_id');
    const sessionId = Cookies.get('auth_session_id');
    const sessionKey = Cookies.get('auth_session_key');

    if (!accountId || !sessionId || !sessionKey) {
      // If any of the auth cookies are missing, redirect to the signin start page
      const currentPageUrl = window.location.href;
      window.location.href = `https://neupgroup.com/account/auth/start?redirect_to=${encodeURIComponent(currentPageUrl)}`;
      return;
    }

    if (accountId) {
      setUser({ account_id: accountId, display_name: accountId });
    }
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'https://neupgroup.com/account';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" onClick={handleProfileClick}>
          <Avatar className="h-9 w-9">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>{user ? user.account_id.substring(0, 2).toUpperCase() : 'JD'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.display_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user ? `${user.account_id}@neupgroup.com` : 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
