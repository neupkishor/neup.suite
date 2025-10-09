
import { z } from 'zod';

const reportBlockBaseSchema = z.object({
  id: z.string(),
});

const titleBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('title'),
  text: z.string().optional(),
});

const subtitleBlockSchema = reportBlockBaseSchema.extend({
    type: z.literal('subtitle'),
    text: z.string().optional(),
});

const paragraphBlockSchema = reportBlockBaseSchema.extend({
    type: z.literal('paragraph'),
    text: z.string().optional(),
});

const chartBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('chart'),
  chartType: z.enum(['bar', 'pie', 'line']).default('bar'),
  dataSource: z.enum(['tasks.byStatus', 'projects.progress', 'activities.byProject']).optional(),
  title: z.string().optional(),
});

const reportBlockSchema = z.discriminatedUnion('type', [
    titleBlockSchema,
    subtitleBlockSchema,
    paragraphBlockSchema,
    chartBlockSchema,
]);

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  type: z.enum(['Project', 'TaskList', 'Document', 'Report']),
  data: z.array(reportBlockSchema),
  version: z.number().default(1),
  clientId: z.string().min(1, 'Client ID is required'),
});

export type Template = z.infer<typeof templateSchema> & { id: string };
export type ReportBlock = z.infer<typeof reportBlockSchema>;
    