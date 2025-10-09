'use server';
/**
 * @fileOverview An AI agent that generates an HTML report template from a text prompt.
 *
 * - aiGenerateReportTemplate - A function that handles the report template generation.
 * - AIGenerateReportTemplateInput - The input type for the function.
 * - AIGenerateReportTemplateOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIGenerateReportTemplateInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the report to be generated.'),
});
export type AIGenerateReportTemplateInput = z.infer<typeof AIGenerateReportTemplateInputSchema>;

const AIGenerateReportTemplateOutputSchema = z.object({
  html: z.string().describe('The generated HTML for the report template.'),
});
export type AIGenerateReportTemplateOutput = z.infer<typeof AIGenerateReportTemplateOutputSchema>;

export async function aiGenerateReportTemplate(input: AIGenerateReportTemplateInput): Promise<AIGenerateReportTemplateOutput> {
  return aiGenerateReportTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGenerateReportTemplatePrompt',
  input: {schema: AIGenerateReportTemplateInputSchema},
  output: {schema: AIGenerateReportTemplateOutputSchema},
  prompt: `You are an expert at creating HTML report templates that use Handlebars-style syntax for placeholders.

  Your task is to generate a clean, modern, and well-structured HTML document based on the user's prompt. The HTML should use simple tags and can include inline styles for basic formatting if necessary, but prefer using semantic HTML.

  You have access to the following data objects and their fields:
  - 'client': Represents the client with fields like 'name', 'contactEmail'.
  - 'tasks': An array of task objects. You can loop through them using '{{#each tasks}}...{{/each}}'. Inside the loop, you can access task fields like 'title', 'description', 'status', and 'deadline'.
  - 'manual': An object for data that the user will enter manually when generating the report. Use placeholders like '{{manual.custom_note}}' or '{{manual.summary_text}}' for these.

  **Instructions:**
  1.  Analyze the user's prompt: {{{prompt}}}
  2.  Create a full HTML document.
  3.  Use Handlebars-style placeholders '{{...}}' to inject dynamic data from the 'client', 'tasks', and 'manual' objects. Use '{{#each tasks}}' for loops.
  4.  The output must be a single block of valid HTML. Do not include any explanation or markdown formatting around the HTML.
  `,
});

const aiGenerateReportTemplateFlow = ai.defineFlow(
  {
    name: 'aiGenerateReportTemplateFlow',
    inputSchema: AIGenerateReportTemplateInputSchema,
    outputSchema: AIGenerateReportTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
