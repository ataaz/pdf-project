"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadAreaProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export function ImageUploadArea({ onFilesAdded, className }: ImageUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const imageFiles = Array.from(files).filter(
        (file) => file.type === 'image/jpeg' || file.type === 'image/jpg'
      );

      if (imageFiles.length === 0) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload JPG images only.',
          variant: 'destructive',
        });
        return;
      }
      onFilesAdded(imageFiles);
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
    if (!isDragging) setIsDragging(true); // Ensure dragging state is true
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
    // Reset input value to allow uploading the same file again
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
      aria-label="Image upload area"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <UploadCloud className={cn("w-16 h-16 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
      <p className={cn("text-lg font-semibold", isDragging ? "text-primary" : "text-foreground")}>
        Drag & drop JPG images here
      </p>
      <p className={cn("text-sm", isDragging ? "text-primary/80" : "text-muted-foreground")}>
        or click to select files
      </p>
    </div>
  );
}
