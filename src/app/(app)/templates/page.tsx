
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddItemCard } from "@/components/add-item-card";
import { FileStack } from "lucide-react";
import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "Templates",
// };

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Templates</CardTitle>
                <CardDescription>
                Create and manage reusable templates for your projects, tasks, and more.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard
            title="Create New Template"
            href="/templates/create"
            icon={FileStack}
        />
      </div>
    </div>
  );
}
