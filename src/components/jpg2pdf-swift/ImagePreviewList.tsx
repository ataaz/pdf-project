"use client";

import React from 'react';
import Image from 'next/image';
import { UploadedImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImagePreviewListProps {
  images: UploadedImage[];
  onReorder: (images: UploadedImage[]) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function ImagePreviewList({ images, onReorder, onRemove, className }: ImagePreviewListProps) {
  if (images.length === 0) {
    return null;
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const item = newImages.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newImages.splice(newIndex, 0, item);
    onReorder(newImages);
  };

  return (
    <ScrollArea className={className} style={{ maxHeight: 'calc(100vh - 300px)'}}>
      <div className="space-y-4 p-1">
        {images.map((image, index) => (
          <Card key={image.id} className="overflow-hidden shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-2 cursor-grab" aria-label="Drag to reorder (visual cue only)">
                 <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="relative w-20 h-20 flex-shrink-0 m-2 rounded overflow-hidden">
                <Image
                  src={image.dataUrl}
                  alt={image.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="document photo"
                />
              </div>
              <CardHeader className="py-2 px-4 flex-grow min-w-0">
                <CardTitle className="text-sm font-medium truncate" title={image.name}>
                  {image.name}
                </CardTitle>
              </CardHeader>
              <CardFooter className="py-2 px-4 flex space-x-1 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  aria-label={`Move ${image.name} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  aria-label={`Move ${image.name} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(image.id)}
                  className="text-destructive hover:text-destructive/90"
                  aria-label={`Remove ${image.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
