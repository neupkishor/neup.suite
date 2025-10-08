'use server';

/**
 * @fileOverview An AI agent that suggests next steps and highlights pending actions for clients.
 *
 * - suggestActions - A function that generates suggested actions based on project data.
 * - SuggestActionsInput - The input type for the suggestActions function.
 * - SuggestActionsOutput - The return type for the suggestActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsInputSchema = z.object({
  projectData: z
    .string()
    .describe(
      'Real-time project data, including tasks, deadlines, progress, and client interactions.'
    ),
});
export type SuggestActionsInput = z.infer<typeof SuggestActionsInputSchema>;

const SuggestActionsOutputSchema = z.object({
  suggestedActions: z
    .string()
    .describe(
      'A list of suggested actions for the client, prioritized by urgency and impact.'
    ),
  pendingDeadlines: z
    .string()
    .describe('A summary of upcoming deadlines and their potential impact.'),
});
export type SuggestActionsOutput = z.infer<typeof SuggestActionsOutputSchema>;

export async function suggestActions(
  input: SuggestActionsInput
): Promise<SuggestActionsOutput> {
  return suggestActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsPrompt',
  input: {schema: SuggestActionsInputSchema},
  output: {schema: SuggestActionsOutputSchema},
  prompt: `You are an AI assistant that helps clients stay on track with their projects.

  Based on the following project data, provide a list of suggested actions for the client and highlight any pending deadlines.

  Project Data: {{{projectData}}}

  Suggested Actions:
  Pending Deadlines: `,
});

const suggestActionsFlow = ai.defineFlow(
  {
    name: 'suggestActionsFlow',
    inputSchema: SuggestActionsInputSchema,
    outputSchema: SuggestActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
