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
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/neontek.png" alt="PostCraft AI Logo" width={32} height={32} />
            <h1 className="text-2xl font-headline font-bold text-foreground">
              PostCraft AI
            </h1>
          </div>
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
      <footer className="py-8 px-4 border-t bg-background/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="text-center md:text-left">
        <p className="font-semibold text-foreground">
          © {new Date().getFullYear()} <a href="https://neontek.co.ke" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">NeonTek</a>. All rights reserved.
        </p>
        <div className="mt-2 flex flex-wrap gap-4 justify-center md:justify-start text-muted-foreground text-sm">
          <a href="https://neontek.co.ke/legal/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">Terms of Use</a>
          <a href="https://neontek.co.ke/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">Privacy Policy</a>
          <a href="https://neontek.co.ke/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">Contact</a>
          <a href="https://neontek.co.ke/about" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">About NeonTek</a>
        </div>
          </div>
          <div className="text-center md:text-right">
        <p className="font-semibold mb-2 text-foreground">Explore More NeonTek Apps:</p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-end text-sm">
          <a href="https://neontek.co.ke/apps/post-craft" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">PostCraft AI</a>
          <a href="https://neontek.co.ke/apps/fapiao" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">Fapiao</a>
          <a href="https://neontek.co.ke/apps/magistra" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">Magistra</a>
          <a href="https://neontek.co.ke/apps/qr-generator" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">QR Generator</a>
          <a href="https://neontek.co.ke/apps" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition">All Apps</a>
        </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
