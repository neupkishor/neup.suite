'use server';
/**
 * @fileOverview An AI chatbot that answers client FAQs based on the provided knowledge base.
 *
 * - aiAnswerClientFAQs - A function that handles the client FAQ answering process.
 * - AIAnswerClientFAQsInput - The input type for the aiAnswerClientFAQs function.
 * - AIAnswerClientFAQsOutput - The return type for the aiAnswerClientFAQs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAnswerClientFAQsInputSchema = z.object({
  question: z.string().describe('The question asked by the client.'),
  knowledgeBase: z
    .string()
    .describe('The knowledge base content used to answer questions.'),
});
export type AIAnswerClientFAQsInput = z.infer<typeof AIAnswerClientFAQsInputSchema>;

const AIAnswerClientFAQsOutputSchema = z.object({
  answer: z.string().describe('The answer to the client question.'),
});
export type AIAnswerClientFAQsOutput = z.infer<typeof AIAnswerClientFAQsOutputSchema>;

export async function aiAnswerClientFAQs(input: AIAnswerClientFAQsInput): Promise<AIAnswerClientFAQsOutput> {
  return aiAnswerClientFAQsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAnswerClientFAQsPrompt',
  input: {schema: AIAnswerClientFAQsInputSchema},
  output: {schema: AIAnswerClientFAQsOutputSchema},
  prompt: `You are a helpful AI chatbot that answers client questions based on the provided knowledge base.\n\nKnowledge Base:\n{{knowledgeBase}}\n\nQuestion: {{question}}\n\nAnswer: `,
});

const aiAnswerClientFAQsFlow = ai.defineFlow(
  {
    name: 'aiAnswerClientFAQsFlow',
    inputSchema: AIAnswerClientFAQsInputSchema,
    outputSchema: AIAnswerClientFAQsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
