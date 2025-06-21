
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FolderKanban, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdBanner } from '@/components/AdBanner';

export default function OrganizePdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    setPdfFile(file);
  };

  const handleReset = useCallback(() => {
    setPdfFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    
    toast({ 
        title: 'Feature Not Available',
        description: 'A full-featured PDF organizer is not yet implemented. This functionality is coming soon!',
        duration: 5000,
    });
    
    setTimeout(() => {
        setIsProcessing(false);
    }, 1000);

  }, [pdfFile, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Organize PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Rearrange, delete, or add pages to your PDF</p>
          </div>
        </div>
      </header>
      <AdBanner className="my-8" />
      <main className="flex flex-col items-start gap-8">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>1. Upload Your PDF</CardTitle>
            <CardDescription>Select the PDF file you want to organize.</CardDescription>
          </CardHeader>
          <CardContent>
            {!pdfFile ? (
              <div
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={isProcessing}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                  <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm font-medium truncate" title={pdfFile.name}>
                    {pdfFile.name}
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleReset} disabled={isProcessing}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove and start over
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>2. Organize Pages</CardTitle>
            <CardDescription>This feature is currently under development. The page organizer below is a placeholder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-center text-muted-foreground">PDF page previews and organization tools will appear here.</p>
            </div>
            <Button onClick={handleSaveChanges} disabled={!pdfFile || isProcessing} className="w-full text-lg py-6">
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
