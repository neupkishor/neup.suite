
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
  prompt: `You are an expert at creating beautiful, modern, and well-structured HTML report templates. The templates use Handlebars-style syntax for placeholders.

  Your task is to generate a full, self-contained HTML document based on the user's prompt. The styling should be clean, professional, and included directly in the HTML file using a <style> tag in the <head>.

  **Styling Guidelines:**
  - Use a modern, clean design aesthetic.
  - For colors, use CSS variables that are already defined in the app to ensure brand consistency. Key variables include:
    - \`--primary\`: For main headers, links, and highlights. (e.g., \`color: hsl(var(--primary));\`)
    - \`--foreground\`: For primary body text.
    - \`--muted-foreground\`: For secondary or less important text.
    - \`--background\`: For the page background.
    - \`--card\`: For the background of card-like elements.
    - \`--border\`: For borders.
  - Do NOT use external CSS files. All styles must be inside a <style> block.

  **Data Placeholders:**
  You have access to the following data objects. Use Handlebars-style placeholders '{{...}}' to inject this data.

  1.  **Dynamic Data (pre-filled by the system):**
      - \`client\`: Represents the client. Access fields like \`{{client.name}}\` and \`{{client.contactEmail}}\`.
      - \`tasks\`: An array of task objects. Loop through them using \`{{#each tasks}}...{{/each}}\`. Inside the loop, access task fields like \`{{this.title}}\`, \`{{this.description}}\`, \`{{this.status}}\`, and \`{{this.deadline}}\`.

  2.  **Manual Entry Data (will be collected from the user):**
      - **CRITICAL:** For any data that needs to be manually entered by the user when they generate the report, you MUST use the \`{{manual.your_field_name}}\` format. The system will automatically create a form field for each unique \`manual\` placeholder.
      - Example: For a user to add a custom summary, you would include a placeholder like \`{{manual.report_summary}}\`. For an introductory paragraph, use \`{{manual.introduction_text}}\`.

  ❗ Important: You must NEVER generate placeholders with empty or undefined names.
  - Every Handlebars tag must be of the form {{client.field}}, {{manual.field}}, or {{#each tasks}}...{{/each}} with valid field names.
  - Do not generate invalid placeholders like those with missing or undefined values inside the curly braces.

  **User's Prompt:**
  {{prompt}}

  **Output Instructions:**
  - The final output must be a single block of valid, complete HTML.
  - Do not include any explanation, comments, or markdown formatting around the HTML code.
  - Start with \`<!DOCTYPE html>\` and include \`<head>\` and \`<body>\` sections.
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
    
    let html = output!.html;

    html = html
      .replace(/\{\{\s*undefined\s*\}\}/g, '')
      .replace(/\{\{\s*manual\.\s*\}\}/g, '')
      .replace(/\{\{\s*\}\}/g, '');

    return { html };
  }
);
