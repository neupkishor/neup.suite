
'use client';
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddItemCard } from "@/components/add-item-card";
import { Briefcase } from "lucide-react";
import type { Client } from "@/schemas/client";
import { cn } from "@/lib/utils";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

function ClientCard({ client, isSelected, onSelect }: { client: Client, isSelected: boolean, onSelect: (id: string) => void }) {
    return (
        <Card 
            onClick={() => onSelect(client.id)}
            className={cn("cursor-pointer transition-all", isSelected ? "border-primary ring-2 ring-primary" : "hover:border-primary/50")}
        >
            <CardContent className="p-4">
                <p className="font-semibold text-lg">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.contactEmail}</p>
            </CardContent>
        </Card>
    )
}

export default function ClientsPage() {
    const firestore = useFirestore();
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedClientId = Cookies.get('client');
        if (savedClientId) {
            setSelectedClientId(savedClientId);
        }
    }, []);

    const clientsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'clients') as CollectionReference<Client>;
    }, [firestore]);

    const { data: clients, loading } = useCollection<Client>(clientsCollection);
    
    const sortedClients = useMemo(() => {
        if (!clients) return [];
        if (!selectedClientId) return clients;

        return [...clients].sort((a, b) => {
            if (a.id === selectedClientId) return -1;
            if (b.id === selectedClientId) return 1;
            return 0;
        });
    }, [clients, selectedClientId]);

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
        {!loading && (
            <AddItemCard
                title="New Client"
                href="/clients/create"
                icon={Briefcase}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {sortedClients?.map((client) => (
            <ClientCard key={client.id} client={client} isSelected={selectedClientId === client.id} onSelect={handleSelectClient} />
        ))}
        {!loading && clients?.length === 0 && (
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
