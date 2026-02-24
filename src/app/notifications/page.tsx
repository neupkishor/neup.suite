
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle, UserPlus } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      created_at: 'desc',
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
        <CardDescription>
          View your recent notifications and updates.
        </CardDescription>
      </CardHeader>
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You have no new notifications.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full ${
                  notification.type === 'mention' ? 'bg-blue-100 text-blue-600' :
                  notification.type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {notification.type === 'mention' ? <Bell className="w-4 h-4" /> :
                   notification.type === 'assignment' ? <UserPlus className="w-4 h-4" /> :
                   <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {/* <Button variant="ghost" size="sm">Mark as read</Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
