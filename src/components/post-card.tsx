'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Download, Copy, Check } from 'lucide-react';
import { optimizeHashtagsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface Post {
  copy: string;
  hashtags: string[];
  imageUrl: string;
}

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentHashtags, setCurrentHashtags] = useState(post.hashtags);
  const [copied, setCopied] = useState<'copy' | 'tags' | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    setIsOptimizing(true);
    const result = await optimizeHashtagsAction(post.copy, currentHashtags);
    setIsOptimizing(false);

    if (result.error) {
      toast({
        title: 'Optimization Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.optimizedHashtags) {
      setCurrentHashtags(result.optimizedHashtags);
      toast({
        title: 'Hashtags Optimized!',
        description: 'Your post\'s hashtags have been updated with AI-powered suggestions.',
      });
    }
  };

  const handleCopy = (type: 'copy' | 'tags') => {
    const textToCopy =
      type === 'copy'
        ? post.copy
        : currentHashtags.map(h => `#${h}`).join(' ');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(type);
      toast({ title: `Copied ${type === 'copy' ? 'caption' : 'hashtags'}!` });
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `postcraft-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not download the image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={post.imageUrl}
          alt={`Social media post image ${index + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleDownload}
          title="Download Image"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4 flex-grow">
        <p className="text-foreground text-sm leading-relaxed">{post.copy}</p>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {currentHashtags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Button onClick={() => handleCopy('copy')} className="w-full" variant="outline">
              {copied === 'copy' ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied === 'copy' ? 'Copied!' : 'Copy Caption'}
            </Button>
            <Button onClick={() => handleCopy('tags')} className="w-full" variant="outline">
              {copied === 'tags' ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied === 'tags' ? 'Copied!' : 'Copy Tags'}
            </Button>
          </div>
          <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full" variant="outline">
            {isOptimizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Optimize Hashtags'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
