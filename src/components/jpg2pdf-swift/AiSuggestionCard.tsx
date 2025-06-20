"use client";

import React, { useState, useCallback } from 'react';
import { UploadedImage } from '@/lib/types';
import { aiEnhancedLayoutSuggestion, AiEnhancedLayoutOutput } from '@/ai/flows/ai-enhanced-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AiSuggestionCardProps {
  images: UploadedImage[];
  className?: string;
}

export function AiSuggestionCard({ images, className }: AiSuggestionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiEnhancedLayoutOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = useCallback(async () => {
    if (images.length === 0) {
      toast({
        title: 'No Images',
        description: 'Please upload images before getting an AI suggestion.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const imageDataUris = images.map((img) => img.dataUrl);
      const result = await aiEnhancedLayoutSuggestion({ imageDataUris });
      setSuggestion(result);
    } catch (err) {
      console.error('AI suggestion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get AI suggestion: ${errorMessage}`);
      toast({
        title: 'AI Suggestion Error',
        description: `Could not fetch layout suggestion. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [images, toast]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          AI Layout Suggestion
        </CardTitle>
        <CardDescription>
          Let AI recommend the optimal layout for your images.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Analyzing images...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {suggestion && !isLoading && (
          <div className="space-y-3 p-4 bg-secondary/50 rounded-md">
            <div>
              <h4 className="font-semibold text-foreground">Suggested Layout:</h4>
              <p className="text-sm text-muted-foreground">{suggestion.suggestedLayout}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Reasoning:</h4>
              <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetSuggestion} disabled={isLoading || images.length === 0} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get AI Suggestion
        </Button>
      </CardFooter>
    </Card>
  );
}
