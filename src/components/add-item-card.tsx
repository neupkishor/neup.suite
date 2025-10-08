
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
      <Card className="border border-input hover:border-primary hover:text-primary transition-all">
        <CardContent className="flex flex-row items-center p-4 gap-3">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          <p className="font-medium">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
