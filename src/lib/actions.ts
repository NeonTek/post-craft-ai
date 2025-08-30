'use server';

import {optimizePostHashtags} from '@/ai/flows/optimize-post-hashtags';
import type {OptimizePostHashtagsInput} from '@/ai/schemas/optimize-post-hashtags';
import {generatePosts} from '@/ai/flows/generate-posts';
import type {GeneratePostsInput} from '@/ai/schemas/generate-posts';
import type {Post} from '@/app/page';

export async function optimizeHashtagsAction(
  postCopy: string,
  originalHashtags: string[]
): Promise<{optimizedHashtags?: string[]; error?: string}> {
  try {
    const input: OptimizePostHashtagsInput = {
      postCopy,
      originalHashtags,
    };
    const result = await optimizePostHashtags(input);
    return {optimizedHashtags: result.optimizedHashtags};
  } catch (error) {
    console.error('Error optimizing hashtags:', error);
    // In a real app, you might want to log this error to a monitoring service
    return {
      error: 'Could not optimize hashtags at this time. Please try again later.',
    };
  }
}

export async function generatePostsAction(
  input: GeneratePostsInput
): Promise<{posts?: Post[]; error?: string}> {
  try {
    const result = await generatePosts(input);
    return {posts: result.posts};
  } catch (error) {
    console.error('Error generating posts:', error);
    return {
      error: 'Could not generate posts at this time. Please try again later.',
    };
  }
}
