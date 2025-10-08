
'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

type AddItemCardProps = {
    title: string;
    href: string;
    icon?: React.ElementType;
}

export function AddItemCard({ title, href, icon: Icon = Plus }: AddItemCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full border-2 border-dashed border-muted-foreground/50 hover:border-primary hover:text-primary transition-all">
        <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
          <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="mt-2 font-medium">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
