"use client";

import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Spline, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PdfUploadArea } from '@/components/split-pdf/PdfUploadArea';
import { PageSelector } from '@/components/split-pdf/PageSelector';
import { ActionButtons } from '@/components/jpg2pdf-swift/ActionButtons';

export default function SplitPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileAdded = useCallback(async (file: File) => {
    setIsProcessing(true);
    toast({ title: 'Processing PDF', description: 'Reading file details...' });
    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
      setPdfFile(file);
      setSelectedPages([]); // Reset selection
      toast({ title: 'PDF Loaded', description: `Your file "${file.name}" has ${pdfDoc.getPageCount()} pages.` });
    } catch (error) {
      console.error("Error reading PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "PDF Read Error",
        description: `Could not read the PDF file. ${errorMessage}`,
        variant: "destructive",
      });
      handleReset();
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setPageCount(0);
    setSelectedPages([]);
  }, []);

  const handleSplitPdf = useCallback(async () => {
    if (!pdfFile || selectedPages.length === 0) {
      toast({
        title: 'Selection Missing',
        description: 'Please select at least one page to create a new PDF.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Splitting PDF', description: 'Creating your new file...' });

    try {
      const { PDFDocument } = await import('pdf-lib');
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      const newPdfDoc = await PDFDocument.create();
      
      const pageIndices = selectedPages.map(p => p - 1).sort((a, b) => a - b);
      
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `split-${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: 'Success!', description: 'Your split PDF has been downloaded.' });
    } catch (error) {
      console.error('PDF splitting error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Splitting Failed',
        description: `Could not split the PDF. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, selectedPages, toast]);


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Spline className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Split PDF</h1>
            <p className="text-lg text-muted-foreground">Extract pages from a PDF file</p>
          </div>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!pdfFile ? (
            <PdfUploadArea onFileAdded={handleFileAdded} isProcessing={isProcessing} />
          ) : (
            <PageSelector
              pageCount={pageCount}
              selectedPages={selectedPages}
              onSelectedPagesChange={setSelectedPages}
            />
          )}
        </div>

        <aside className="space-y-6">
          {pdfFile && (
            <Card>
              <CardHeader>
                  <CardTitle>File Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div className="min-w-0">
                          <p className="text-sm font-medium truncate" title={pdfFile.name}>{pdfFile.name}</p>
                          <p className="text-xs text-muted-foreground">{pageCount} pages</p>
                      </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleReset}>
                      <Trash2 className="mr-2 h-4 w-4"/>
                      Remove File & Start Over
                  </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
                <CardTitle>Split Options</CardTitle>
                <CardDescription>Select pages to include in the new file.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                  The new PDF will contain only the pages you select, in their original order. You have selected <span className="font-bold text-primary">{selectedPages.length}</span> page(s).
                </p>
            </CardContent>
          </Card>
          <ActionButtons
            onConvertAndDownload={handleSplitPdf}
            isConverting={isProcessing}
            canConvert={!!pdfFile && selectedPages.length > 0}
            buttonText="Split PDF & Download"
            convertingText="Splitting..."
          />
        </aside>
      </main>
    </div>
  );
}
