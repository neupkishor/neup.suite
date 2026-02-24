
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AIAssistant } from '@/app/(app)/home/components/ai-assistant';
import { ProjectProgress } from '@/app/(app)/home/components/project-progress';
import { UpcomingMilestones } from '@/app/(app)/home/components/upcoming-milestones';
import { KeyContacts } from '@/app/(app)/home/components/key-contacts';
import { PaymentStatus } from '@/app/(app)/home/components/payment-status';
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
  const [isClientCheckDone, setIsClientCheckDone] = useState(false);

  useEffect(() => {
    setClientId(Cookies.get('client') || null);
    setIsClientCheckDone(true);
  }, []);

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'projects') as CollectionReference<Project>;
    if (clientId) {
      return query(q, where('clientId', '==', clientId));
    }
    return query(q);
  }, [firestore, clientId]);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'tasks') as CollectionReference<Task>;
     if (clientId) {
      return query(q, where('clientId', '==', clientId));
    }
    return query(q);
  }, [firestore, clientId]);
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(tasksCollection);
  
  const invoicesCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'invoices') as CollectionReference<Invoice>;
     if (clientId) {
      return query(q, where('clientId', '==', clientId));
    }
    return query(q);
  }, [firestore, clientId]);
  const { data: invoices, loading: invoicesLoading } = useCollection<Invoice>(invoicesCollection);

  const contactsCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'contacts') as CollectionReference<Contact & {id: string}>;
    if (clientId) {
      return query(q, where('clientId', '==', clientId));
    }
    return query(q);
  }, [firestore, clientId]);
  const { data: contacts, loading: contactsLoading } = useCollection<Contact & {id: string}>(contactsCollection);

  const goalsCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'goals') as CollectionReference<Goal>;
    if (clientId) {
      return query(q, where('clientId', '==', clientId));
    }
    return query(q);
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

  const loading = projectsLoading || tasksLoading || invoicesLoading || contactsLoading || goalsLoading || !isClientCheckDone;
  
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
