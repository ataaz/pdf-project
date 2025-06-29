
"use client";

import React, { useState, useCallback } from 'react';
import { UploadedPdf } from '@/lib/types';
import { PdfUploadArea } from '@/components/merge-pdf/PdfUploadArea';
import { PdfPreviewList } from '@/components/merge-pdf/PdfPreviewList';
import { ActionButtons } from '@/components/jpg2pdf-swift/ActionButtons';
import { useToast } from '@/hooks/use-toast';
import { Combine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdBanner } from '@/components/AdBanner';


export default function MergePdfPage() {
  const [pdfs, setPdfs] = useState<UploadedPdf[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();

  const handleFilesAdded = useCallback((files: File[]) => {
    setPdfs((prevPdfs) => {
        const newPdfs = files.map((file, index) => ({
            id: `${file.name}-${file.lastModified}-${prevPdfs.length + index}`,
            file,
            name: file.name,
        }));
        return [...prevPdfs, ...newPdfs];
    });
  }, []);


  const handleReorder = useCallback((reorderedPdfs: UploadedPdf[]) => {
    setPdfs(reorderedPdfs);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  }, []);

  const mergePdfs = useCallback(async () => {
    if (pdfs.length < 2) {
      toast({
        title: 'Not Enough Files',
        description: 'Please upload at least two PDF files to merge.',
        variant: 'destructive',
      });
      return;
    }

    setIsMerging(true);
    toast({ title: 'Merging Started', description: 'Joining your PDF files...' });

    try {
        const { PDFDocument } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();

        for (const pdfFile of pdfs) {
            const pdfBytes = await pdfFile.file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const mergedPdfBytes = await mergedPdf.save();

        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      toast({ title: 'Success!', description: 'Your merged PDF has been downloaded.' });
    } catch (error) {
      console.error('PDF merging error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Merging Failed',
        description: `Could not merge PDFs. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsMerging(false);
    }
  }, [pdfs, toast]);


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Combine className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Merge PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Combine multiple PDF files into one</p>
          </div>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PdfUploadArea onFilesAdded={handleFilesAdded} />
          {pdfs.length > 0 && (
             <PdfPreviewList
                pdfs={pdfs}
                onReorder={handleReorder}
                onRemove={handleRemove}
              />
          )}
        </div>

        <aside className="space-y-6">
          <AdBanner type="vertical" />
          <Card>
            <CardHeader>
                <CardTitle>Merge Settings</CardTitle>
                <CardDescription>Set the order for merging your files.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">The files will be combined from top to bottom. Use the arrows or drag and drop the files on the left to change their order.</p>
            </CardContent>
          </Card>
          <ActionButtons
            onConvertAndDownload={mergePdfs}
            isConverting={isMerging}
            canConvert={pdfs.length > 1}
            buttonText="Merge PDFs & Download"
            convertingText="Merging..."
          />
        </aside>
      </main>
    </div>
  );
}
