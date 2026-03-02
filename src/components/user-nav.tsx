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
    // In a real app, you might fetch the full user from an API or use a context provider
    const accountId = Cookies.get('auth_account_id');
    if (accountId) {
      setUser({ account_id: accountId, display_name: accountId });
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
