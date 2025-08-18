'use server';

import { suggestSimilarTasks } from '@/ai/flows/suggest-similar-tasks';
import { enhanceTask, EnhanceTaskInput, EnhanceTaskOutput } from '@/ai/flows/enhance-task';
import type { Todo } from '@/lib/types';

export async function getAiSuggestions(
  tasks: Todo[]
): Promise<string[]> {
  if (tasks.length === 0) {
    return [];
  }
  try {
    const taskTitles = tasks.map((task) => task.title).filter(title => title.trim() !== '');
    if (taskTitles.length === 0) return [];
    
    const result = await suggestSimilarTasks({ taskTitles });
    return result.suggestedTasks;
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    // Gracefully fail by returning no suggestions
    return [];
  }
}

export async function getEnhancedTask(
  input: EnhanceTaskInput
): Promise<EnhanceTaskOutput> {
  try {
    const result = await enhanceTask(input);
    return result;
  } catch (error) {
    console.error('Error enhancing task:', error);
    // In case of an error, return the original task
    return {
      enhancedTitle: input.title,
    };
  }
}
