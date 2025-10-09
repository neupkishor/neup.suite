
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">New Messages</h4>
                        <p className="text-sm text-muted-foreground">Notify me when I receive a new message in the inbox.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">Task Updates</h4>
                        <p className="text-sm text-muted-foreground">Notify me about updates on my assigned tasks.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">Billing Alerts</h4>
                        <p className="text-sm text-muted-foreground">Notify me about new invoices and payment reminders.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    )
}
