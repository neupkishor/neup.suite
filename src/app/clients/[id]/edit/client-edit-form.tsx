'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { clientSchema } from "@/schemas/client";
import { updateClient } from "@/actions/clients/update-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@/generated/prisma";

interface ClientEditFormProps {
    client: Client;
}

export function ClientEditForm({ client }: ClientEditFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client.name,
      status: (client.status as any) || 'Onboarding',
    },
  });

  async function onSubmit(values: z.infer<typeof clientSchema>) {
    setIsSubmitting(true);

    try {
        const result = await updateClient(client.id, values);
        
        if (result.success) {
            toast({
                title: "Client updated",
                description: "The client has been successfully updated.",
            });
            router.push(`/clients/${client.id}`);
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to update client",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Edit Client</CardTitle>
            <CardDescription>Update the details for this client.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Onboarding">Onboarding</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/clients/${client.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Client
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
