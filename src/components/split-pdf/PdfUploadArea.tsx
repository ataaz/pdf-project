"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PdfUploadAreaProps {
  onFileAdded: (file: File) => void;
  className?: string;
  isProcessing?: boolean;
}

export function PdfUploadArea({ onFileAdded, className, isProcessing }: PdfUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      onFileAdded(file);
    },
    [onFileAdded, toast]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing) return;
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
    if (isProcessing) return;
    if (!isDragging) setIsDragging(true);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isProcessing || e.dataTransfer.files.length === 0) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClick = () => {
    if (isProcessing) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFile(e.target.files[0]);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const effectiveClass = cn(
    'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out',
    isProcessing 
      ? 'cursor-wait bg-muted/50' 
      : 'cursor-pointer',
    isDragging 
      ? 'border-primary bg-primary/10' 
      : 'border-border hover:border-primary/70',
    className
  );

  return (
    <div
      className={effectiveClass}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={isProcessing ? -1 : 0}
      aria-label="PDF upload area"
      aria-disabled={isProcessing}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleInputChange}
        disabled={isProcessing}
      />
      {isProcessing ? (
          <Loader2 className="w-16 h-16 mb-4 animate-spin text-primary" />
      ) : (
          <UploadCloud className={cn("w-16 h-16 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
      )}
      <p className={cn("text-lg font-semibold", isDragging ? "text-primary" : "text-foreground")}>
        {isProcessing ? 'Reading your PDF...' : 'Drag & drop a PDF file here'}
      </p>
      <p className={cn("text-sm", isDragging ? "text-primary/80" : "text-muted-foreground")}>
         {isProcessing ? 'Please wait a moment.' : 'or click to select a file'}
      </p>
    </div>
  );
}
