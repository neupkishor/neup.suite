import { cookies } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { ImportTasksForm } from '@/app/tasks/import/import-form';
import { TemplateType } from '@/generated/prisma';

export default async function ImportTasksPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('client')?.value;

  const [templates, clients] = await Promise.all([
    prisma.template.findMany({
      where: {
        type: TemplateType.TaskList,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Import Tasks from Template</CardTitle>
          <CardDescription>Select a task list template and a client to import tasks for.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImportTasksForm 
            templates={templates} 
            clients={clients} 
            initialClientId={clientId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
