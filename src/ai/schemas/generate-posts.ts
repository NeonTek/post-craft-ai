import {z} from 'genkit';

export const GeneratePostsInputSchema = z.object({
  industry: z.string().describe('The industry of the business.'),
  targetAudience: z.string().describe('The target audience for the posts.'),
  goals: z.string().describe('The business goals, products, or services to promote.'),
  companyName: z.string().describe('The name of the company or business.'),
  moreInfo: z.string().optional().describe('Any additional information about the desired tone, style, or specific points to include.'),
});
export type GeneratePostsInput = z.infer<typeof GeneratePostsInputSchema>;

export const PostSchema = z.object({
  copy: z
    .string()
    .describe(
      'The content of the social media post for a single day. Should be engaging and relevant.'
    ),
  hashtags: z
    .array(z.string())
    .describe('An array of 3-5 relevant hashtags for the post.'),
  imageDescription: z
    .string()
    .describe(
      'A detailed description for a visually appealing, relevant image for the post. This will be used to generate an image.'
    ),
});

export const GeneratePostsOutputSchema = z.object({
  posts: z
    .array(PostSchema)
    .length(30)
    .describe(
      'An array of 30 social media post objects for a 30-day content calendar.'
    ),
});
export type GeneratePostsOutput = z.infer<typeof GeneratePostsOutputSchema>;
