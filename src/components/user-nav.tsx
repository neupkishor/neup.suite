"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImages } from "@/lib/placeholder-images";
import Link from 'next/link';

export function UserNav() {
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');

  return (
    <Link href="/settings">
      <Avatar className="h-9 w-9">
        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Link>
  );
}
