
import { getClients } from "@/actions/clients/get-clients";
import { ClientList } from "./client-list";

export default async function ClientsPage() {
    const { clients, error } = await getClients();

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Error loading clients: {error}
            </div>
        );
    }

    return <ClientList initialClients={clients || []} />;
}
