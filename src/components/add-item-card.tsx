
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
    <Link href={href} className="group">
      <Card className="border-2 border-dashed border-input hover:border-primary hover:text-primary transition-all bg-muted/20 hover:bg-muted/50">
        <CardContent className="flex flex-row items-center justify-center p-4 gap-3 h-full">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          <p className="font-medium">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
