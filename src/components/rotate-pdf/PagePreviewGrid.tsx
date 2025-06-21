"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PagePreview {
  src: string;
  pageNumber: number;
}

interface PagePreviewGridProps {
  previews: PagePreview[];
  rotations: number[];
  onRotate: (index: number, direction: 'left' | 'right') => void;
}

export function PagePreviewGrid({ previews, rotations, onRotate }: PagePreviewGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {previews.map((preview, index) => (
        <Card key={preview.pageNumber} className="overflow-hidden">
          <CardContent className="p-2 aspect-[3/4] relative">
            <Image
              src={preview.src}
              alt={`Page ${preview.pageNumber}`}
              width={200}
              height={282}
              className="object-contain w-full h-full transition-transform duration-200"
              style={{ transform: `rotate(${rotations[index]}deg)` }}
              data-ai-hint="document page"
            />
             <div className="absolute top-2 right-2 bg-background/80 rounded-full px-2 py-0.5 text-xs font-bold">
              {preview.pageNumber}
            </div>
          </CardContent>
          <CardFooter className="p-2 bg-muted/50 grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => onRotate(index, 'left')} aria-label="Rotate left">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onRotate(index, 'right')} aria-label="Rotate right">
              <RotateCw className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
