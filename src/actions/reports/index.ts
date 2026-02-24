'use server';

import { prisma } from '@/lib/prisma';
import { reportSchema } from '@/schemas/report';
import { renderTemplate } from '@/lib/template-renderer';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewReport = z.infer<typeof reportSchema>;
type ReportData = z.infer<typeof reportSchema>;

export async function addReport(reportData: NewReport) {
  try {
    const newReport = await prisma.report.create({
      data: {
        title: reportData.title,
        content: reportData.content,
        clientId: reportData.clientId,
        templateId: reportData.templateId,
        manualData: reportData.manualData ? JSON.parse(JSON.stringify(reportData.manualData)) : undefined,
        generatedOn: new Date(),
      },
    });

    revalidatePath('/reports');
    return newReport;
  } catch (error) {
    console.error('Error creating report:', error);
    throw new Error('Failed to create report');
  }
}

export async function updateReport(id: string, data: ReportData) {
  try {
    const report = await prisma.report.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        clientId: data.clientId,
        templateId: data.templateId,
        manualData: data.manualData ? JSON.parse(JSON.stringify(data.manualData)) : undefined,
      },
    });

    revalidatePath('/reports');
    revalidatePath(`/reports/${id}`);
    return report;
  } catch (error) {
    console.error('Error updating report:', error);
    throw new Error('Failed to update report');
  }
}

export async function deleteReport(id: string) {
  try {
    await prisma.report.delete({
      where: { id },
    });

    revalidatePath('/reports');
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Failed to delete report');
  }
}

const generateSchema = z.object({
  templateId: z.string(),
  clientId: z.string(),
  manualData: z.record(z.string(), z.any()),
});

export async function generateReportAction(input: z.infer<typeof generateSchema>) {
  const { templateId, clientId, manualData } = input;

  // 1. Fetch template
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // 2. Fetch client
  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  // 3. Fetch tasks
  const tasks = await prisma.task.findMany({
    where: { clientId },
  });

  // 4. Combine data
  const fullData = {
    client,
    tasks,
    manual: manualData,
  };

  // 5. Render template
  const reportContent = renderTemplate(template.body, fullData);

  // 6. Save report
  const report = await prisma.report.create({
    data: {
      title: template.name,
      content: reportContent,
      clientId,
      templateId,
      manualData: manualData ? JSON.parse(JSON.stringify(manualData)) : undefined,
      generatedOn: new Date(),
    },
  });

  revalidatePath('/reports');
  return report;
}
