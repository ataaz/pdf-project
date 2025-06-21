"use client";

import React from 'react';
import type { PdfToPowerpointOutput } from '@/ai/flows/pdf-to-powerpoint-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, FileText, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SlidePreviewProps {
  slides: PdfToPowerpointOutput['slides'] | undefined;
  isLoading: boolean;
}

export function SlidePreview({ slides, isLoading }: SlidePreviewProps) {
    const { toast } = useToast();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Generating presentation...</p>
            </div>
        )
    }

    if (!slides || slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Generated slides will be displayed here.</p>
            </div>
        );
    }
    
    const handleCopyToClipboard = () => {
        const textToCopy = slides.map((slide, index) => {
            const title = `Slide ${index + 1}: ${slide.title}`;
            const content = slide.content.map(point => `- ${point}`).join('\n');
            const notes = `Speaker Notes: ${slide.speakerNotes}`;
            return `${title}\n${content}\n${notes}\n\n`;
        }).join('');

        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({ title: 'Copied!', description: 'The presentation content has been copied.' });
        }).catch(err => {
            toast({ title: 'Copy Failed', description: 'Could not copy content.', variant: 'destructive' });
        });
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-end">
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                 >
                    <Clipboard className="mr-2 h-4 w-4" /> Copy All Content
                </Button>
            </div>
            <ScrollArea className="flex-grow h-0 min-h-[400px]">
                <div className="space-y-6 pr-4">
                    {slides.map((slide, index) => (
                        <Card key={index} className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Slide {index + 1}: {slide.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText size={16} /> Content</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {slide.content.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                            {slide.speakerNotes && (
                                <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
                                     <h4 className="font-semibold text-sm flex items-center gap-2"><Mic size={16} /> Speaker Notes</h4>
                                     <p className="text-sm text-muted-foreground">{slide.speakerNotes}</p>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
