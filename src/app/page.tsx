'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PostCard from '@/components/post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';
import { generatePostsAction } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export interface Post {
  copy: string;
  hashtags: string[];
  imageUrl: string;
}

interface AppState {
  companyName: string;
  industry: string;
  targetAudience: string;
  goals: string;
  moreInfo: string;
  posts: Post[];
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    companyName: '',
    industry: '',
    targetAudience: '',
    goals: '',
    moreInfo: '',
    posts: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('postCraftAIState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Basic validation
        if (
          typeof parsedState === 'object' &&
          'industry' in parsedState &&
          'posts' in parsedState
        ) {
          setAppState(prevState => ({ ...prevState, ...parsedState }));
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('postCraftAIState', JSON.stringify(appState));
    } catch (error) {
      console.error('Failed to save state to localStorage', error);
    }
  }, [appState]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setAppState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { companyName, industry, targetAudience, goals, moreInfo } = appState;
    if (!companyName || !industry || !targetAudience || !goals) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields to generate posts.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAppState(prevState => ({ ...prevState, posts: [] }));

    try {
      const result = await generatePostsAction({
        companyName,
        industry,
        targetAudience,
        goals,
        moreInfo,
      });

      if (result.error || !result.posts) {
        throw new Error(result.error || 'Failed to generate posts.');
      }

      setAppState(prevState => ({ ...prevState, posts: result.posts! }));
    } catch (err: any) {
      toast({
        title: 'Error Generating Posts',
        description: err.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
  <div className="container flex h-16 items-center justify-between py-4">
    
    <div className="flex items-center space-x-2 md:space-x-4">
      <a href="https://neontek.co.ke" className="flex items-center space-x-2 font-bold transition-transform hover:scale-105">
        <span className="text-xl text-primary font-black">NeonTek</span>
      </a>
      {/* Visual Separator */}
      <span className="text-gray-400 dark:text-gray-600">|</span>
      <a href="https://neontek.co.ke/apps/post-craft" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors dark:text-gray-300">
        PostCraft AI
      </a>
    </div>

    <nav className="flex items-center space-x-6">
      <div className="hidden md:flex items-center space-x-6">
        <a href="https://neontek.co.ke" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors dark:text-gray-400">
          NeonTek
        </a>
      </div>
      <a
        href="https://neontek.co.ke/contact"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90"
      >
        Contact NeonTek
      </a>
    </nav>

  </div>
</header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">
            Generate a Month of Social Media Posts in Seconds
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Tell us about your business and let our AI craft engaging content tailored to your goals.
          </p>
        </section>

        <Card className="max-w-4xl mx-auto mb-12 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="companyName" className="font-medium">Company / Business Name *</label>
                <Input
                  id="companyName"
                  type="text"
                  value={appState.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., The Cozy Corner Bakery"
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="industry" className="font-medium">Business Industry *</label>
                <Input
                  id="industry"
                  type="text"
                  value={appState.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., local bakery, fitness gym"
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="targetAudience" className="font-medium">Target Audience *</label>
                <Input
                  id="targetAudience"
                  type="text"
                  value={appState.targetAudience}
                  onChange={handleInputChange}
                  placeholder="e.g., young professionals, families"
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="goals" className="font-medium">Business Goals / Products / Services *</label>
              <Textarea
                id="goals"
                value={appState.goals}
                onChange={handleInputChange}
                placeholder="e.g., increase engagement, promote new sourdough bread and coffee drinks, sell subscription boxes"
                className="w-full"
                rows={3}
                disabled={isLoading}
                required
              />
            </div>
             <div className="space-y-2">
              <label htmlFor="moreInfo" className="font-medium">Additional Information (Optional)</label>
              <Textarea
                id="moreInfo"
                value={appState.moreInfo}
                onChange={handleInputChange}
                placeholder="e.g., prefer a witty and humorous tone, focus on eco-friendly aspects, mention our weekly specials"
                className="w-full"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Generating...' : 'Generate 30 Posts'}
            </Button>
          </form>
        </Card>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && appState.posts.length > 0 && (
          <>
            <h3 className="text-3xl font-bold font-headline text-center mb-8">Your 30-Day Content Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {appState.posts.map((post, index) => (
                <PostCard key={index} post={post} index={index} />
              ))}
            </div>
          </>
        )}

        {!isLoading && appState.posts.length === 0 && (
          <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
              <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Ready to create?</h3>
              <p className="mt-2 text-muted-foreground">Fill in your business details above to get started.</p>
          </div>
        )}
      </main>
      <footer className="py-12 px-4 border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 text-sm text-gray-600 dark:text-gray-400">

    {/* Section 1 */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-span-1 lg:col-span-2">
      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">NeonTek</h3>
      <p className="mt-2 text-xs">
        © {new Date().getFullYear()} NeonTek. All rights reserved.
      </p>
      <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
        <a href="https://neontek.co.ke/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
        <a href="https://neontek.co.ke/legal/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Terms of Use</a>
        <a href="https://neontek.co.ke/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Contact</a>
      </div>
    </div>

    {/* Section 2 */}
    <div className="text-center md:text-left">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Explore Our Apps</h4>
      <div className="flex flex-col items-center md:items-start space-y-2">
        <a href="https://neontek.co.ke/apps/post-craft" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">PostCraft AI</a>
        <a href="https://neontek.co.ke/apps/fapiao" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Fapiao</a>
        <a href="https://neontek.co.ke/apps/magistra" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Magistra</a>
        <a href="https://neontek.co.ke/apps/qr-generator" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">QR Generator</a>
        <a href="https://neontek.co.ke/apps" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">All Apps</a>
      </div>
    </div>

    {/* Section 3 */}
    <div className="flex justify-center md:justify-end text-center md:text-right md:col-span-1 lg:col-span-1">
      <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors underline-offset-4 hover:underline">
        Images from Pexels
      </a>
    </div>

  </div>
</footer>
    </div>
  );
}
