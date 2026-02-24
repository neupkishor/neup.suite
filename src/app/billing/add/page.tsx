'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { InvoiceForm } from '@/app/(app)/billing/components/invoice-form';
import { getClient } from '@/actions/clients/get-clients';

export default function AddInvoicePage() {
  const [clientId, setClientId] = useState<string|null>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Cookies.get('client') || null;
    setClientId(id);
    
    if (id) {
        getClient(id).then(res => {
            if (res.success) {
                setClient(res.client);
            }
            setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-8 max-w-2xl mt-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
        </CardContent>
      </Card>
    )
  }

  if (!clientId) {
    return <Card>
        <CardHeader>
            <CardTitle>No Client Selected</CardTitle>
            <CardDescription>You must select a client before creating an invoice.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/clients">Select a Client</Link>
          </Button>
        </CardContent>
    </Card>
  }

  return <InvoiceForm clientId={clientId} clientName={client?.name} />;
}
