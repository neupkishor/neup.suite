import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CreateProjectForm } from "./create-project-form";

export default async function CreateProjectPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const clients = await prisma.client.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    return (
        <CreateProjectForm 
            clients={clients} 
            initialClientId={clientId || null} 
        />
    );
}
