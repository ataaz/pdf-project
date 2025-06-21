"use client";

import React from 'react';
import { UploadedPdf } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ArrowUp, ArrowDown, GripVertical, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PdfPreviewListProps {
  pdfs: UploadedPdf[];
  onReorder: (pdfs: UploadedPdf[]) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function PdfPreviewList({ pdfs, onReorder, onRemove, className }: PdfPreviewListProps) {
  if (pdfs.length === 0) {
    return null;
  }

  const movePdf = (index: number, direction: 'up' | 'down') => {
    const newPdfs = [...pdfs];
    const item = newPdfs.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newPdfs.splice(newIndex, 0, item);
    onReorder(newPdfs);
  };

  return (
    <ScrollArea className={className} style={{ maxHeight: 'calc(100vh - 300px)'}}>
      <div className="space-y-4 p-1">
        {pdfs.map((pdf, index) => (
          <Card key={pdf.id} className="overflow-hidden shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-2 cursor-grab" aria-label="Drag to reorder (visual cue only)">
                 <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="p-2 flex-shrink-0">
                <FileText className="h-8 w-8 text-primary/70" />
              </div>
              <CardHeader className="py-2 px-4 flex-grow min-w-0">
                <CardTitle className="text-sm font-medium truncate" title={pdf.name}>
                  {pdf.name}
                </CardTitle>
              </CardHeader>
              <CardFooter className="py-2 px-4 flex space-x-1 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => movePdf(index, 'up')}
                  disabled={index === 0}
                  aria-label={`Move ${pdf.name} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => movePdf(index, 'down')}
                  disabled={index === pdfs.length - 1}
                  aria-label={`Move ${pdf.name} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(pdf.id)}
                  className="text-destructive hover:text-destructive/90"
                  aria-label={`Remove ${pdf.name}`}
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
