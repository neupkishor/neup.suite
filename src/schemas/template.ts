
import { z } from 'zod';

const reportBlockBaseSchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'subtitle', 'paragraph', 'keyValue', 'chart']),
});

const titleBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('title'),
  text: z.string(),
});

const subtitleBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('subtitle'),
  text: z.string(),
});

const paragraphBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('paragraph'),
  text: z.string(),
});

const keyValueBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('keyValue'),
  key: z.string(),
  valueSource: z.string(), // e.g., 'project.name'
});

const chartBlockSchema = reportBlockBaseSchema.extend({
  type: z.literal('chart'),
  chartType: z.enum(['bar', 'pie', 'line']),
  dataSource: z.string(), // e.g., 'tasks.byStatus'
});

const reportBlockSchema = z.discriminatedUnion('type', [
    titleBlockSchema,
    subtitleBlockSchema,
    paragraphBlockSchema,
    keyValueBlockSchema,
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
    