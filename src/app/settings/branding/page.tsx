
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/context/branding-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BrandingSettingsPage() {
    const { toast } = useToast();
    const { appName, setAppName, primaryColor, setPrimaryColor } = useBranding();
    const [name, setName] = useState(appName);
    const [color, setColor] = useState(primaryColor);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    useEffect(() => {
        setName(appName);
        setColor(primaryColor);
    }, [appName, primaryColor])

    const handleBrandingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Simulate API call, in reality we're just saving to localStorage
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            setAppName(name);
            setPrimaryColor(color);
            toast({
                title: "Branding Updated",
                description: "Your branding settings have been saved.",
            });
        } catch (error) {
            setSubmitError("Failed to update branding. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl">Branding</CardTitle>
                <CardDescription>Customize the portal with your own branding.</CardDescription>
            </CardHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Brand Customization</CardTitle>
                    <CardDescription>Update the app name and color scheme.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleBrandingSubmit} className="space-y-6 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="appName">App Name</Label>
                            <Input id="appName" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    id="primaryColor" 
                                    type="color" 
                                    value={color} 
                                    onChange={e => setColor(e.target.value)} 
                                    className="p-1 h-10 w-14"
                                />
                                <Input 
                                    value={color} 
                                    onChange={e => setColor(e.target.value)} 
                                    className="w-28"
                                />
                                <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: color }}></div>
                            </div>
                        </div>
                        <div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                Save Branding
                            </Button>
                        </div>
                         {submitError && (
                            <p className="text-sm font-medium text-destructive">
                                {submitError}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
