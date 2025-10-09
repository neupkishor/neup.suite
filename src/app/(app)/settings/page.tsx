
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-6">
      <section className="space-y-6">
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
       <section className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">App Integrations</h3>
                <p className="text-sm text-muted-foreground">Connect your favorite tools with Neup.Suite.</p>
            </div>
            <div className="text-sm text-muted-foreground">
                <p>Integration options will be available here.</p>
            </div>
        </section>
    </div>
  );
}
