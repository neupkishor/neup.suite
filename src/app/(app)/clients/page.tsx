import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Clients CRM</CardTitle>
        <CardDescription>
          This section is for internal team members to manage client relationships.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Client relationship management features will be available here.</p>
      </CardContent>
    </Card>
  );
}
