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
import { collection, CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useMemo } from 'react';
import type { Project } from '@/schemas/project';
import type { Task } from '@/schemas/task';
import type { Invoice } from '@/schemas/invoice';
import type { Contact } from '@/schemas/contact';
import type { Goal } from '@/schemas/goal';

export default function HomePage() {
  const firestore = useFirestore();

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects') as CollectionReference<Project>;
  }, [firestore]);
  const { data: projects } = useCollection<Project>(projectsCollection);

  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'tasks') as CollectionReference<Task>;
  }, [firestore]);
  const { data: tasks } = useCollection<Task>(tasksCollection);
  
  const invoicesCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'invoices') as CollectionReference<Invoice>;
  }, [firestore]);
  const { data: invoices } = useCollection<Invoice>(invoicesCollection);

  const contactsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'contacts') as CollectionReference<Contact & {id: string}>;
  }, [firestore]);
  const { data: contacts } = useCollection<Contact & {id: string}>(contactsCollection);

  const goalsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'goals') as CollectionReference<Goal>;
  }, [firestore]);
  const { data: goals } = useCollection<Goal>(goalsCollection);

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
