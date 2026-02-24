
import { getClient } from "@/actions/clients/get-clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ClientActions } from "./client-actions";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { client, error } = await getClient(id);

    if (error || !client) {
        return notFound();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">{client.name}</CardTitle>
                        <CardDescription>
                            Status: {client.status || 'N/A'}
                        </CardDescription>
                    </div>
                    <ClientActions clientId={client.id} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Created On</h3>
                            <p>{new Date(client.created_on).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Client ID</h3>
                            <p className="font-mono text-sm">{client.id}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
