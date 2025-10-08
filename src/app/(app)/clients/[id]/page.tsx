'use client';
import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const clientId = Cookies.get('client');
    
    // As a placeholder for user authentication check
    const isUserLoggedIn = true; 

    if (!clientId && !isUserLoggedIn) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The page you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/landing">Go to Landing Page</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (!clientId) {
         return (
            <Card>
                <CardHeader>
                    <CardTitle>No Client Selected</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please select a client from the clients page.</p>
                    <Button asChild className="mt-4">
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }
  
    // In a real app, you would fetch client data here based on the id
    // and show a 404 if not found.
    if (id !== clientId) {
      // For this example, we'll just check if the URL id matches the cookie
      // In a real app, you would fetch data and check existence
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Client Details: {id}</CardTitle>
        <CardDescription>
          This is where details and projects for the selected client would be displayed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>You are managing client with ID: {id}</p>
      </CardContent>
    </Card>
  );
}
