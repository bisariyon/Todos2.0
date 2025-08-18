'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting similar tasks based on existing task titles.
 *
 * It exports:
 *   - suggestSimilarTasks: An async function that takes an array of task titles and returns an array of suggested similar task titles.
 *   - SuggestSimilarTasksInput: The input type for the suggestSimilarTasks function.
 *   - SuggestSimilarTasksOutput: The output type for the suggestSimilarTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestSimilarTasksInputSchema = z.object({
  taskTitles: z.array(z.string()).describe('An array of existing task titles.'),
});
export type SuggestSimilarTasksInput = z.infer<typeof SuggestSimilarTasksInputSchema>;

// Define the output schema
const SuggestSimilarTasksOutputSchema = z.object({
  suggestedTasks: z.array(z.string()).describe('An array of suggested similar task titles.'),
});
export type SuggestSimilarTasksOutput = z.infer<typeof SuggestSimilarTasksOutputSchema>;

// Define a tool to check if similar tasks suggestions would be helpful
const isSimilarityHelpfulTool = ai.defineTool({
  name: 'isSimilarityHelpful',
  description: 'Determines whether suggesting similar tasks would be helpful in the current context based on the number of existing tasks.',
  inputSchema: z.object({
    numberOfTasks: z.number().describe('The number of existing tasks.'),
  }),
  outputSchema: z.boolean().describe('Whether suggesting similar tasks would be helpful.'),
},
async (input) => {
  // Implement logic to determine if suggestions are helpful based on the number of tasks
  // For example, suggestions might be more helpful when there are fewer tasks
  return input.numberOfTasks < 5; // Suggest if there are less than 5 tasks
});

// Define the prompt
const suggestSimilarTasksPrompt = ai.definePrompt({
  name: 'suggestSimilarTasksPrompt',
  input: {schema: SuggestSimilarTasksInputSchema},
  output: {schema: SuggestSimilarTasksOutputSchema},
  tools: [isSimilarityHelpfulTool],
  prompt: `You are a task management assistant. Given a list of existing task titles, suggest similar tasks that the user might want to add to their list.

Existing Tasks:
{{#each taskTitles}}- {{this}}\n{{/each}}

Consider the context of the existing tasks and suggest tasks that are closely related and would help the user expand their task list efficiently.

If the isSimilarityHelpful tool returns false, respond with an empty array.

Output format: array of strings representing task titles.`, // Provide clear instructions for the prompt
});

// Define the flow
const suggestSimilarTasksFlow = ai.defineFlow(
  {
    name: 'suggestSimilarTasksFlow',
    inputSchema: SuggestSimilarTasksInputSchema,
    outputSchema: SuggestSimilarTasksOutputSchema,
  },
  async input => {
    const isHelpful = await isSimilarityHelpfulTool({
      numberOfTasks: input.taskTitles.length,
    });

    if (!isHelpful) {
      return {suggestedTasks: []};
    }

    const {output} = await suggestSimilarTasksPrompt(input);
    return output!;
  }
);

/**
 * Suggests similar tasks based on existing task titles.
 * @param input The input containing an array of task titles.
 * @returns The output containing an array of suggested similar task titles.
 */
export async function suggestSimilarTasks(input: SuggestSimilarTasksInput): Promise<SuggestSimilarTasksOutput> {
  return suggestSimilarTasksFlow(input);
}
