import {z} from 'genkit';

export const OptimizePostHashtagsInputSchema = z.object({
  postCopy: z.string().describe('The social media post copy.'),
  originalHashtags: z
    .array(z.string())
    .describe('The original hashtags for the post.'),
});
export type OptimizePostHashtagsInput = z.infer<
  typeof OptimizePostHashtagsInputSchema
>;

export const OptimizePostHashtagsOutputSchema = z.object({
  optimizedHashtags: z
    .array(z.string())
    .describe('The optimized hashtags for the post.'),
});
export type OptimizePostHashtagsOutput = z.infer<
  typeof OptimizePostHashtagsOutputSchema
>;
