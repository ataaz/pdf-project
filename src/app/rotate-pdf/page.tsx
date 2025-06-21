"use client";

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';
import { RotateCw, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PagePreviewGrid } from '@/components/rotate-pdf/PagePreviewGrid';
import { PDFDocument, degrees } from 'pdf-lib';

// Set worker source for pdfjs from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PagePreview {
  src: string;
  pageNumber: number;
}

export default function RotatePdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
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

    setIsProcessing(true);
    toast({ title: 'Loading PDF', description: 'Generating page previews...' });

    try {
      setPdfFile(file);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      const previews: PagePreview[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          previews.push({ src: canvas.toDataURL('image/png'), pageNumber: i });
        }
      }
      setPagePreviews(previews);
      setRotations(Array(numPages).fill(0));
      toast({ title: 'PDF Loaded', description: 'You can now rotate the pages.' });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({ title: 'Error', description: 'Could not load the PDF file.', variant: 'destructive' });
      handleReset();
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setPagePreviews([]);
    setRotations([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleRotatePage = (index: number, direction: 'left' | 'right') => {
    const newRotations = [...rotations];
    const currentRotation = newRotations[index];
    const newRotation = direction === 'left' ? (currentRotation - 90 + 360) % 360 : (currentRotation + 90) % 360;
    newRotations[index] = newRotation;
    setRotations(newRotations);
  };

  const handleApplyRotation = useCallback(async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    toast({ title: 'Applying Rotations', description: 'Creating your new PDF...' });

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      
      pdfDoc.getPages().forEach((page, index) => {
        const rotation = rotations[index];
        if (rotation !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `rotated-${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: 'Success!', description: 'Your rotated PDF has been downloaded.' });
    } catch (error) {
      console.error('Error applying rotation:', error);
      toast({ title: 'Error', description: 'Could not apply rotations to the PDF.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, rotations, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <RotateCw className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Rotate PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Rotate one or all pages in your PDF</p>
          </div>
        </div>
        {pdfFile && !isProcessing && (
           <Button onClick={handleApplyRotation} disabled={isProcessing} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Apply Changes & Download
          </Button>
        )}
      </header>
      
      <main className="flex flex-col items-start gap-8">
        {!pdfFile ? (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Upload Your PDF</CardTitle>
              <CardDescription>Select the PDF file you want to rotate.</CardDescription>
            </CardHeader>
            <CardContent>
               <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                  onClick={() => !isProcessing && inputRef.current?.click()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading PDF...</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</p>
                    </>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                    disabled={isProcessing}
                  />
                </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">Rotate individual pages as needed.</p>
                 <Button variant="outline" onClick={handleReset}>
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Start Over
                 </Button>
            </div>
            <PagePreviewGrid
              previews={pagePreviews}
              rotations={rotations}
              onRotate={handleRotatePage}
            />
          </div>
        )}
      </main>
    </div>
  );
}
