"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PdfUploadAreaProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export function PdfUploadArea({ onFilesAdded, className }: PdfUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === 'application/pdf'
      );

      if (pdfFiles.length !== files.length) {
        toast({
          title: 'Invalid File Type',
          description: 'One or more files were not PDFs and have been ignored.',
          variant: 'destructive',
        });
      }
      
      if (pdfFiles.length === 0) {
        if (files.length > 0) { // Only show if some files were selected but none were PDFs
             toast({
                title: 'No PDF files selected',
                description: 'Please upload PDF files only.',
                variant: 'destructive',
            });
        }
        return;
      }
      onFilesAdded(pdfFiles);
    },
    [onFilesAdded, toast]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out',
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="PDF upload area"
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <UploadCloud className={cn("w-16 h-16 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
      <p className={cn("text-lg font-semibold", isDragging ? "text-primary" : "text-foreground")}>
        Drag & drop PDF files here
      </p>
      <p className={cn("text-sm", isDragging ? "text-primary/80" : "text-muted-foreground")}>
        or click to select files
      </p>
    </div>
  );
}
