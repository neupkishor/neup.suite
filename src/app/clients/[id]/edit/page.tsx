
import { getClient } from "@/actions/clients/get-clients";
import { notFound } from "next/navigation";
import { ClientEditForm } from "./client-edit-form";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { client, error } = await getClient(id);

    if (error || !client) {
        return notFound();
    }

    return <ClientEditForm client={client} />;
}
