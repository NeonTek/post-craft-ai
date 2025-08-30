'use server';
/**
 * @fileOverview A Genkit flow to generate social media posts.
 *
 * - generatePosts - Generates 30 social media posts.
 */

import {ai} from '@/ai/genkit';
import {
  GeneratePostsInput,
  GeneratePostsInputSchema,
  GeneratePostsOutputSchema,
} from '@/ai/schemas/generate-posts';
import {z} from 'genkit';

const postGenerationPrompt = ai.definePrompt({
  name: 'postGenerationPrompt',
  input: {schema: GeneratePostsInputSchema},
  output: {schema: GeneratePostsOutputSchema},
  prompt: `You are an expert social media manager. Your task is to generate a 30-day content calendar for a business.

  Business Information:
  - Company Name: {{{companyName}}}
  - Industry: {{{industry}}}
  - Target Audience: {{{targetAudience}}}
  - Goals/Products/Services: {{{goals}}}
  {{#if moreInfo}}- Additional Info: {{{moreInfo}}}{{/if}}
  
  Please generate 30 days of social media posts. Each post must include:
  1.  **Copy**: Engaging and relevant text for the post.
  2.  **Hashtags**: 3-5 relevant hashtags.
  3.  **Image Description**: A brief description for a visually appealing image that matches the post's content.
  
  Create a diverse range of content, including promotional posts, behind-the-scenes looks, user-generated content ideas, educational content, and engaging questions. Ensure the tone is appropriate for the target audience and any additional information provided.`,
});

const generatePostsFlow = ai.defineFlow(
  {
    name: 'generatePostsFlow',
    inputSchema: GeneratePostsInputSchema,
    outputSchema: z.object({
      posts: z.array(
        z.object({
          copy: z.string(),
          hashtags: z.array(z.string()),
          imageUrl: z.string(),
        })
      ),
    }),
  },
  async (input: GeneratePostsInput) => {
    const llmResponse = await postGenerationPrompt(input);
    const postIdeas = llmResponse.output?.posts;

    if (!postIdeas) {
      throw new Error('Failed to generate post ideas.');
    }

    const posts = postIdeas.map((idea, index) => {
      return {
        copy: idea.copy,
        hashtags: idea.hashtags,
        imageUrl: `https://picsum.photos/600/400?random=${index}`, // Use picsum for placeholders
      };
    });

    return {posts};
  }
);


export async function generatePosts(
  input: GeneratePostsInput
): Promise<{posts: {copy: string; hashtags: string[]; imageUrl: string}[]}> {
  return generatePostsFlow(input);
}
