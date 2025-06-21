
"use client";

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import { useToast } from '@/hooks/use-toast';
import { FileText, UploadCloud, Loader2, Clipboard, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { extractContentFromPdfImages } from '@/ai/flows/pdf-to-word-flow';
import { Progress } from '@/components/ui/progress';
import { AdBanner } from '@/components/AdBanner';

// Set worker source for pdfjs from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfToWordPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
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
    setExtractedContent('');
    setProgress(0);
    setProgressMessage('');
  };
  
  const handleReset = useCallback(() => {
    setPdfFile(null);
    setExtractedContent('');
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
    setExtractedContent('');

    try {
      // 1. Render PDF pages to images
      setProgressMessage('Step 1/2: Rendering PDF pages...');
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
          pageImagesDataUris.push(canvas.toDataURL('image/png'));
        }
        setProgress(((i / numPages) * 50)); // Progress for rendering part
      }
      
      // 2. Call AI flow to extract content
      setProgressMessage('Step 2/2: Extracting content with AI...');
      setProgress(50);
      const result = await extractContentFromPdfImages({ pageImagesDataUris });
      setProgress(100);

      if (result.extractedContent) {
        setExtractedContent(result.extractedContent);
        toast({
          title: 'Conversion Successful',
          description: 'The PDF content has been extracted.',
        });
      } else {
        throw new Error("AI did not return any content.");
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
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(extractedContent).then(() => {
      toast({ title: 'Copied!', description: 'The content has been copied to your clipboard.' });
    }).catch(err => {
      toast({ title: 'Copy Failed', description: 'Could not copy content.', variant: 'destructive' });
    });
  };
  
  const handleDownload = () => {
    if (!pdfFile) return;
    const blob = new Blob([extractedContent], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const docName = pdfFile.name.replace(/\.[^/.]+$/, "");
    link.download = `${docName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">PDF to Word</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Extract text from your PDF using AI</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <AdBanner type="vertical" />
           <Card>
            <CardHeader>
              <CardTitle>1. Upload PDF</CardTitle>
              <CardDescription>Select the PDF file you want to convert.</CardDescription>
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
              <CardTitle>2. Convert</CardTitle>
              <CardDescription>Start the AI-powered conversion process.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleConvert} disabled={!pdfFile || isProcessing} className="w-full">
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? 'Converting...' : 'Convert to Text'}
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
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>3. Get Result</CardTitle>
                  <CardDescription>Your extracted content will appear below in Markdown format.</CardDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    disabled={!extractedContent || isProcessing}
                  >
                    <Clipboard className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!extractedContent || isProcessing}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                className="h-full min-h-[400px] font-mono"
                placeholder="Extracted content will be displayed here..."
                value={extractedContent}
                readOnly
              />
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
