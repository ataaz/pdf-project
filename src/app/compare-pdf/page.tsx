
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { GitCompareArrows, UploadCloud, FileText, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AdBanner } from '@/components/AdBanner';

const PdfDropzone = ({
  file,
  onFileChange,
  title,
  disabled,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  title: string;
  disabled: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    const selectedFile = files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    onFileChange(selectedFile);
  };
  
  const handleReset = () => {
     onFileChange(null);
     if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Upload one of the files to compare.</CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Click or drag file here</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
              <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReset}
              disabled={disabled}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove file
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function ComparePdfPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCompare = useCallback(() => {
     if (!file1 || !file2) return;
     setIsProcessing(true);
     toast({
        title: 'Feature Under Construction',
        description: 'We are still building our advanced PDF comparison tool. Check back soon!',
        duration: 5000,
     });
     setTimeout(() => setIsProcessing(false), 1000);
  }, [file1, file2, toast]);


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Compare PDFs</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Find differences between two PDF files.</p>
          </div>
        </div>
      </header>
       <AdBanner className="my-8" />
       <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PdfDropzone 
                file={file1}
                onFileChange={setFile1}
                title="Original Document"
                disabled={isProcessing}
            />
             <PdfDropzone 
                file={file2}
                onFileChange={setFile2}
                title="Revised Document"
                disabled={isProcessing}
            />
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Compare & View Differences</CardTitle>
                <CardDescription>Once both files are uploaded, click compare to see the results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button 
                    onClick={handleCompare}
                    disabled={!file1 || !file2 || isProcessing}
                    className="w-full text-lg py-6"
                >
                    {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GitCompareArrows className="mr-2 h-5 w-5" />}
                    {isProcessing ? 'Analyzing...' : 'Compare Files'}
                </Button>
                <div className="p-4 border rounded-lg bg-muted/50 mt-4">
                    <p className="text-center text-muted-foreground">Comparison results will appear here.</p>
                </div>
            </CardContent>
          </Card>
      </main>
    </div>
  );
}
