
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AIAssistant } from './components/ai-assistant';
import { ProjectProgress } from './components/project-progress';
import { UpcomingMilestones } from './components/upcoming-milestones';
import { KeyContacts } from './components/key-contacts';
import { PaymentStatus } from './components/payment-status';
import { useCollection } from '@/firebase';
import { collection, CollectionReference, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useMemo, useState, useEffect } from 'react';
import type { Project } from '@/schemas/project';
import type { Task } from '@/schemas/task';
import type { Invoice } from '@/schemas/invoice';
import type { Contact } from '@/schemas/contact';
import type { Goal } from '@/schemas/goal';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const firestore = useFirestore();
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    setClientId(Cookies.get('client') || null);
  }, []);

  const projectsCollection = useMemo(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'projects') as CollectionReference<Project>, where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

  const tasksCollection = useMemo(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'tasks') as CollectionReference<Task>, where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(tasksCollection);
  
  const invoicesCollection = useMemo(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'invoices') as CollectionReference<Invoice>, where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: invoices, loading: invoicesLoading } = useCollection<Invoice>(invoicesCollection);

  const contactsCollection = useMemo(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'contacts') as CollectionReference<Contact & {id: string}>, where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: contacts, loading: contactsLoading } = useCollection<Contact & {id: string}>(contactsCollection);

  const goalsCollection = useMemo(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'goals') as CollectionReference<Goal>, where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: goals, loading: goalsLoading } = useCollection<Goal>(goalsCollection);

  const projectDataString = useMemo(() => {
    let data = '';
    if (projects) {
      data += 'Projects:\n' + projects.map(p => `- ${p.name}: ${p.status}, Deadline: ${p.deadline}`).join('\n');
    }
    if (tasks) {
      data += '\n\nTasks:\n' + tasks.map(t => `- ${t.title}: ${t.status}`).join('\n');
    }
     if (invoices) {
      data += '\n\nInvoices:\n' + invoices.map(i => `- ${i.invoiceId}: ${i.amount} ${i.currency}, Status: ${i.status}`).join('\n');
    }
    return data;
  }, [projects, tasks, invoices]);

  const loading = projectsLoading || tasksLoading || invoicesLoading || contactsLoading || goalsLoading;

  if (!clientId && !loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Welcome to Neup.Suite</CardTitle>
                <CardDescription>Select a client to view their dashboard and start managing projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/clients">Select a Client</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    )
  }
  
  if (loading) {
      return <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
        </div>
        <div className="space-y-6 lg:col-span-1">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
        </div>
    </div>
  }


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Welcome, Jane
            </CardTitle>
            <CardDescription>
              Here's a summary of your projects and pending actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIAssistant projectData={projectDataString} />
          </CardContent>
        </Card>
        <KeyContacts contacts={contacts} />
      </div>
      <div className="space-y-6 lg:col-span-1">
        <PaymentStatus invoices={invoices} />
        <ProjectProgress projects={projects} />
        <UpcomingMilestones goals={goals} />
      </div>
    </div>
  );
}
