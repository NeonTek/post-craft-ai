'use server';

/**
 * @fileOverview A Genkit flow that optimizes social media post hashtags using AI.
 *
 * - optimizePostHashtags - A function that optimizes the hashtags for a given post copy.
 */

import {ai} from '@/ai/genkit';
import {
  OptimizePostHashtagsInput,
  OptimizePostHashtagsInputSchema,
  OptimizePostHashtagsOutput,
  OptimizePostHashtagsOutputSchema,
} from '@/ai/schemas/optimize-post-hashtags';

export async function optimizePostHashtags(
  input: OptimizePostHashtagsInput
): Promise<OptimizePostHashtagsOutput> {
  return optimizePostHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizePostHashtagsPrompt',
  input: {schema: OptimizePostHashtagsInputSchema},
  output: {schema: OptimizePostHashtagsOutputSchema},
  prompt: `You are a social media expert. Given the following post copy and original hashtags, you will optimize the hashtags to increase reach and engagement.\n\nPost Copy: {{{postCopy}}}\nOriginal Hashtags: {{#each originalHashtags}}{{{this}}} {{/each}}\n\nProvide only optimized hashtags.\n`,
});

const optimizePostHashtagsFlow = ai.defineFlow(
  {
    name: 'optimizePostHashtagsFlow',
    inputSchema: OptimizePostHashtagsInputSchema,
    outputSchema: OptimizePostHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
