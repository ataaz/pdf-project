
"use client";

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import { useToast } from '@/hooks/use-toast';
import { ScanSearch, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ocrPdfImages } from '@/ai/flows/ocr-pdf-flow';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { AdBanner } from '@/components/AdBanner';

// Set worker source for pdfjs from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  dataUrl: string;
  width: number;
  height: number;
}

export default function OcrPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
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
    setProgress(0);
    setProgressMessage('');
  };
  
  const handleReset = useCallback(() => {
    setPdfFile(null);
    setIsProcessing(false);
    setProgress(0);
    setProgressMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleOcr = useCallback(async () => {
    if (!pdfFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a PDF file for OCR.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Render PDF pages to images
      setProgressMessage('Step 1/3: Reading PDF document...');
      setProgress(0);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const pageImages: PageImage[] = [];
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Use higher scale for better OCR accuracy
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          pageImages.push({
              dataUrl: canvas.toDataURL('image/png'),
              width: canvas.width,
              height: canvas.height,
          });
        }
        setProgress( (i / numPages) * 33 );
      }
      
      // 2. Call AI flow to perform OCR
      setProgressMessage('Step 2/3: Performing OCR with AI...');
      const result = await ocrPdfImages({ pageImagesDataUris: pageImages.map(p => p.dataUrl) });
      setProgress(66);
      
      if (!result || !result.pages || result.pages.length === 0) {
        throw new Error("AI OCR process failed to return valid data.");
      }
      
      // 3. Reconstruct PDF with invisible text layer
      setProgressMessage('Step 3/3: Creating searchable PDF...');
      const newPdfDoc = await PDFDocument.create();
      const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < result.pages.length; i++) {
        const ocrPage = result.pages[i];
        const originalImage = pageImages[i];
        
        // Use the dimensions from the original image for consistency
        const page = newPdfDoc.addPage([originalImage.width, originalImage.height]);
        
        const imageBytes = await fetch(originalImage.dataUrl).then(res => res.arrayBuffer());
        const embeddedImage = await newPdfDoc.embedPng(imageBytes);

        // Draw original image as background
        page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: originalImage.width,
            height: originalImage.height,
        });
        
        // Draw invisible text for searchability
        ocrPage.words.forEach(word => {
            const { x, y, width, height } = word.bbox;
            // pdf-lib's origin is bottom-left, so we need to convert y-coordinate
            const y_pdflib = originalImage.height - y - height;
            
            // This is a rough approximation for font size. A more robust solution might
            // try to scale font size based on bounding box height.
            const fontSize = height * 0.8;

            page.drawText(word.text, {
                x,
                y: y_pdflib,
                font,
                size: fontSize,
                opacity: 0, // Makes text invisible but selectable/searchable
            });
        });
        setProgress(66 + ((i / numPages) * 34));
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `searchable-${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
          title: 'Success!',
          description: `Your searchable PDF has been downloaded.`,
      });

    } catch (error) {
      console.error('OCR failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'OCR Process Failed',
        description: `Could not process the PDF. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [pdfFile, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ScanSearch className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">OCR PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Make scanned PDFs searchable and selectable.</p>
          </div>
        </div>
      </header>
      <AdBanner className="my-8" />
      <main className="flex flex-col items-start gap-8">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>1. Upload PDF</CardTitle>
                <CardDescription>Select the scanned PDF you want to make searchable.</CardDescription>
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
        
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>2. Run OCR & Download</CardTitle>
                <CardDescription>This process uses AI and may take some time.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleOcr} disabled={!pdfFile || isProcessing} className="w-full text-lg py-6">
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-5 w-5" />
                  )}
                  {isProcessing ? 'Processing...' : 'Make Searchable & Download'}
                </Button>
                 {isProcessing && (
                <div className="mt-4 space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground text-center">{progressMessage}</p>
                </div>
              )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
