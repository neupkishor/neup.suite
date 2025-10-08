
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Replace with your actual save logic
            // For now, we'll just simulate success
            toast({
                title: "Profile Updated",
                description: "Your personal information has been saved successfully.",
            });
        } catch (error) {
            setSubmitError("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Settings</CardTitle>
            <CardDescription>Manage your account, branding, and notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Profile Section */}
            <section className="max-w-2xl space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details here.</p>
                </div>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Jane" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                    </div>
                    <div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                     {submitError && (
                        <p className="text-sm font-medium text-destructive">
                            {submitError}
                        </p>
                    )}
                </form>
            </section>

            <Separator />

            {/* Branding Section */}
            <section className="max-w-2xl space-y-6">
                <div>
                    <h3 className="text-lg font-medium">White-Labeling</h3>
                    <p className="text-sm text-muted-foreground">Customize the portal with your own branding (Premium feature).</p>
                </div>
                <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">Logo</span>
                        </div>
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                        <Input id="primaryColor" defaultValue="#3399FF" className="w-24" />
                        <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: '#3399FF' }}></div>
                    </div>
                </div>
                <Button>Save Branding</Button>
            </section>

            <Separator />

            {/* Notifications Section */}
            <section className="max-w-2xl space-y-6">
                 <div>
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Manage how you receive notifications.</p>
                </div>
                <div className="space-y-4">
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
                </div>
            </section>
            
            <Separator />

            {/* Integrations Section */}
            <section className="max-w-2xl space-y-6">
                 <div>
                    <h3 className="text-lg font-medium">App Integrations</h3>
                    <p className="text-sm text-muted-foreground">Connect your favorite tools with Neup.Suite.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    <p>Integration options will be available here.</p>
                </div>
            </section>
        </CardContent>
    </Card>
  );
}
