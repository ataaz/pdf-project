"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface PageSelectorProps {
  pageCount: number;
  selectedPages: number[];
  onSelectedPagesChange: (pages: number[]) => void;
}

export function PageSelector({ pageCount, selectedPages, onSelectedPagesChange }: PageSelectorProps) {

  const handlePageSelect = (pageNumber: number) => {
    onSelectedPagesChange(
      selectedPages.includes(pageNumber)
        ? selectedPages.filter(p => p !== pageNumber)
        : [...selectedPages, pageNumber]
    );
  };
  
  const handleSelectAll = () => {
    const allPages = Array.from({ length: pageCount }, (_, i) => i + 1);
    onSelectedPagesChange(allPages);
  };

  const handleClearAll = () => {
    onSelectedPagesChange([]);
  };
  
  const handleSelectRange = () => {
    const range = prompt("Enter a page range (e.g., 1-5, 8, 10-12):");
    if (!range) return;

    const newSelection = new Set<number>(selectedPages);
    const parts = range.split(',').map(part => part.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= pageCount) newSelection.add(i);
          }
        }
      } else {
        const page = Number(part);
        if (!isNaN(page) && page > 0 && page <= pageCount) {
          newSelection.add(page);
        }
      }
    });
    onSelectedPagesChange(Array.from(newSelection));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Pages</CardTitle>
        <CardDescription>Choose the pages you want to keep. Click a page to select or deselect it.</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={handleSelectAll}>Select All</Button>
            <Button size="sm" variant="outline" onClick={handleClearAll}>Clear Selection</Button>
            <Button size="sm" variant="outline" onClick={handleSelectRange}>Select Range (e.g., 1-5, 8)</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => (
              <label
                key={pageNumber}
                htmlFor={`page-${pageNumber}`}
                className="flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer aspect-square transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                data-state={selectedPages.includes(pageNumber) ? 'checked' : 'unchecked'}
              >
                <Checkbox
                  id={`page-${pageNumber}`}
                  checked={selectedPages.includes(pageNumber)}
                  onCheckedChange={() => handlePageSelect(pageNumber)}
                  className="absolute opacity-0"
                />
                <span className="font-bold text-lg">{pageNumber}</span>
                <span className="text-xs text-muted-foreground">Page</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}