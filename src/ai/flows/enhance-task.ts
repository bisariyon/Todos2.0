'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing a task's title.
 *
 * It exports:
 *   - enhanceTask: An async function that takes a task title and returns an enhanced version.
 *   - EnhanceTaskInput: The input type for the enhanceTask function.
 *   - EnhanceTaskOutput: The output type for the enhanceTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const EnhanceTaskInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
});
export type EnhanceTaskInput = z.infer<typeof EnhanceTaskInputSchema>;

// Define the output schema
const EnhanceTaskOutputSchema = z.object({
  enhancedTitle: z.string().describe('The enhanced title of the task.'),
});
export type EnhanceTaskOutput = z.infer<typeof EnhanceTaskOutputSchema>;

// Define the prompt
const enhanceTaskPrompt = ai.definePrompt({
  name: 'enhanceTaskPrompt',
  input: {schema: EnhanceTaskInputSchema},
  output: {schema: EnhanceTaskOutputSchema},
  prompt: `You are a helpful assistant that enhances task descriptions. Correct any grammar or spelling mistakes and make the following task title more clear and concise.

Task Title: {{{title}}}

Return the enhanced title.
`,
});

// Define the flow
const enhanceTaskFlow = ai.defineFlow(
  {
    name: 'enhanceTaskFlow',
    inputSchema: EnhanceTaskInputSchema,
    outputSchema: EnhanceTaskOutputSchema,
  },
  async input => {
    const {output} = await enhanceTaskPrompt(input);
    return output!;
  }
);

/**
 * Enhances the task title using AI.
 * @param input The input containing the task title.
 * @returns The output containing the enhanced title.
 */
export async function enhanceTask(input: EnhanceTaskInput): Promise<EnhanceTaskOutput> {
  return enhanceTaskFlow(input);
}
