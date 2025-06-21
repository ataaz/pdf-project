
"use client";

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';
import { Table2Icon, UploadCloud, Loader2, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { extractTablesFromPdfImages, type PdfToExcelOutput } from '@/ai/flows/pdf-to-excel-flow';
import { Progress } from '@/components/ui/progress';
import { TablePreview } from '@/components/pdf-to-excel/TablePreview';
import { AdBanner } from '@/components/AdBanner';

// Set worker source for pdfjs from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfToExcelPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [extractedData, setExtractedData] = useState<PdfToExcelOutput | null>(null);
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
    setExtractedData(null);
    setProgress(0);
    setProgressMessage('');
  };
  
  const handleReset = useCallback(() => {
    setPdfFile(null);
    setExtractedData(null);
    setIsProcessing(false);
    setProgress(0);
    setProgressMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!pdfFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a PDF file to convert.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setExtractedData(null);

    try {
      // 1. Render PDF pages to images
      setProgressMessage('Step 1/2: Analyzing PDF document...');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const pageImagesDataUris: string[] = [];
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          pageImagesDataUris.push(canvas.toDataURL('image/jpeg')); // Use JPEG for smaller size
        }
        setProgress(((i / numPages) * 50));
      }
      
      // 2. Call AI flow to extract tables
      setProgressMessage('Step 2/2: Extracting tables with AI...');
      setProgress(50);
      const result = await extractTablesFromPdfImages({ pageImagesDataUris });
      setProgress(100);

      if (result && result.tables) {
        if (result.tables.length === 0) {
            toast({
                title: 'No Tables Found',
                description: 'The AI could not find any tables in the document.',
            });
        } else {
             toast({
                title: 'Extraction Successful',
                description: `Found ${result.tables.length} table(s) in the document.`,
            });
        }
        setExtractedData(result);
      } else {
        throw new Error("AI did not return a valid response.");
      }

    } catch (error) {
      console.error('Conversion failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not convert the PDF. ${errorMessage}`,
        variant: 'destructive',
      });
      handleReset();
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [pdfFile, toast, handleReset]);
  
  const baseFileName = pdfFile?.name.replace(/\.[^/.]+$/, "") || 'download';

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Table2Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">PDF to Excel</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Extract tables from your PDF to Excel using AI</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <AdBanner type="vertical" />
           <Card>
            <CardHeader>
              <CardTitle>1. Upload PDF</CardTitle>
              <CardDescription>Select the PDF file containing tables.</CardDescription>
            </CardHeader>
            <CardContent>
              {!pdfFile ? (
                <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload</p>
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
          
          <Card>
            <CardHeader>
              <CardTitle>2. Extract Tables</CardTitle>
              <CardDescription>Start the AI-powered extraction process.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleConvert} disabled={!pdfFile || isProcessing} className="w-full">
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Table2Icon className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? 'Extracting...' : 'Extract Tables'}
              </Button>
              {isProcessing && (
                <div className="mt-4 space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground text-center">{progressMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card className="h-full flex flex-col">
             <CardHeader>
                <div>
                  <CardTitle>3. Download Results</CardTitle>
                  <CardDescription>Your extracted tables will appear below. Download them as XLSX files.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <TablePreview
                    tables={extractedData?.tables}
                    isLoading={isProcessing}
                    baseFileName={baseFileName}
                />
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
