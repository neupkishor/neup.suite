'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { projectSchema } from "@/schemas/project";
import { createProject } from "@/actions/projects/create-project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client } from "@/generated/prisma";

interface CreateProjectFormProps {
    clients: Client[];
    initialClientId: string | null;
}

export function CreateProjectForm({ clients, initialClientId }: CreateProjectFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      status: 'Planning',
      clientId: initialClientId || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
        const result = await createProject({
            ...values,
            deadline: format(values.deadline, "yyyy-MM-dd"),
        });

        if (result.success) {
            router.push('/projects');
        } else {
            setIsSubmitting(false);
            setSubmitError(result.error || "Failed to create project");
        }
    } catch (error) {
        setIsSubmitting(false);
        setSubmitError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Create a New Project</CardTitle>
            <CardDescription>Fill out the details below to start a new project.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="no-client">No Client</SelectItem>
                                {clients?.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormDescription>
                            Associate this project with a client.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Website Redesign" {...field} />
                            </FormControl>
                            <FormDescription>
                            This is the name of your project.
                            </FormDescription>
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
                                <SelectItem value="Planning">Planning</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Deadline</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP")
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date < new Date("1900-01-01")
                                }
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormDescription>
                            The deadline for the project.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {submitError && (
                        <div className="text-destructive text-sm font-medium">
                            {submitError}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/projects">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
