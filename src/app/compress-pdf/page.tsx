
"use client";

import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Minimize2, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PdfUploadArea } from '@/components/compress-pdf/PdfUploadArea';
import { ActionButtons } from '@/components/jpg2pdf-swift/ActionButtons';
import { CompressionSettings, CompressionLevel } from '@/components/compress-pdf/CompressionSettings';

export default function CompressPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileAdded = useCallback(async (file: File) => {
    setPdfFile(file);
    toast({ title: 'File Ready', description: `Ready to compress "${file.name}".` });
  }, [toast]);

  const handleReset = useCallback(() => {
    setPdfFile(null);
  }, []);

  const handleCompressPdf = useCallback(async () => {
    if (!pdfFile) {
      toast({
        title: 'No File',
        description: 'Please upload a PDF file to compress.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Compressing PDF', description: 'This may take a moment...' });

    try {
      const { PDFDocument } = await import('pdf-lib');
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

      // pdf-lib doesn't offer granular image compression, but re-saving with object streams
      // can often reduce file size by optimizing the PDF structure.
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `compressed-${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const originalSize = (pdfFile.size / 1024 / 1024).toFixed(2);
      const newSize = (blob.size / 1024 / 1024).toFixed(2);
      
      toast({ 
        title: 'Success!', 
        description: `Your compressed PDF has been downloaded. Original: ${originalSize}MB, New: ${newSize}MB.`
      });
      
    } catch (error) {
      console.error('PDF compression error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Compression Failed',
        description: `Could not compress the PDF. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, compressionLevel, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Minimize2 className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Compress PDF</h1>
            <p className="text-lg text-muted-foreground">Reduce the size of your PDF file</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!pdfFile ? (
            <PdfUploadArea onFileAdded={handleFileAdded} isProcessing={isProcessing} />
          ) : (
            <Card>
              <CardHeader>
                  <CardTitle>File Ready for Compression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div className="min-w-0">
                          <p className="text-sm font-medium truncate" title={pdfFile.name}>{pdfFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleReset}>
                      <Trash2 className="mr-2 h-4 w-4"/>
                      Remove File & Start Over
                  </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <CompressionSettings 
            level={compressionLevel}
            onLevelChange={setCompressionLevel}
            disabled={!pdfFile || isProcessing}
          />
          <ActionButtons
            onConvertAndDownload={handleCompressPdf}
            isConverting={isProcessing}
            canConvert={!!pdfFile}
            buttonText="Compress PDF & Download"
            convertingText="Compressing..."
          />
        </aside>
      </main>
    </div>
  );
}
