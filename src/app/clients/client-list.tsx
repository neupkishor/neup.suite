'use client';

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddItemCard } from "@/components/add-item-card";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import type { Client } from "@/generated/prisma"; // Use Prisma type

function ClientCard({ client, isSelected, onSelect }: { client: Client, isSelected: boolean, onSelect: (id: string) => void }) {
    return (
        <Card 
            onClick={() => onSelect(client.id)}
            className={cn("cursor-pointer transition-all", isSelected ? "border-primary ring-2 ring-primary" : "hover:border-primary/50")}
        >
            <CardContent className="p-4">
                <p className="font-semibold text-lg">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.status}</p>
            </CardContent>
        </Card>
    )
}

interface ClientListProps {
    initialClients: Client[];
}

export function ClientList({ initialClients }: ClientListProps) {
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedClientId = Cookies.get('client');
        if (savedClientId) {
            setSelectedClientId(savedClientId);
        }
    }, []);

    const sortedClients = useMemo(() => {
        if (!initialClients) return [];
        if (!selectedClientId) return initialClients;

        return [...initialClients].sort((a, b) => {
            if (a.id === selectedClientId) return -1;
            if (b.id === selectedClientId) return 1;
            return 0;
        });
    }, [initialClients, selectedClientId]);

    const handleSelectClient = (id: string) => {
        setSelectedClientId(id);
        Cookies.set('client', id, { expires: 365 });
        router.push('/home');
    }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Clients</CardTitle>
                <CardDescription>Select a client to manage their projects and tasks.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard
            title="New Client"
            href="/clients/create"
            icon={Briefcase}
        />
        {sortedClients.map((client) => (
            <ClientCard key={client.id} client={client} isSelected={selectedClientId === client.id} onSelect={handleSelectClient} />
        ))}
        {initialClients.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No clients found. Add one to get started.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
