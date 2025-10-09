
'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function BrandingSettingsPage() {

    return (
        <div className="space-y-6">
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
        </div>
    )
}
