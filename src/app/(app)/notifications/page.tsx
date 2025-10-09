
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
        <CardDescription>
          View your recent notifications and updates.
        </CardDescription>
      </CardHeader>
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          You have no new notifications.
        </CardContent>
      </Card>
    </div>
  );
}
