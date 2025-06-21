
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Hash, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NumberSettings, type PageNumberSettings } from '@/components/add-page-numbers/NumberSettings';
import { AdBanner } from '@/components/AdBanner';

export default function AddPageNumbersPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState<PageNumberSettings>({
    position: 'bottom_center',
    margin: 30,
    fontSize: 12,
    fontColor: '#000000',
    format: 'Page {page} of {total}',
  });

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

  const handleAddNumbers = useCallback(async () => {
    if (!pdfFile) {
        toast({ title: 'No File', description: 'Please upload a PDF file.', variant: 'destructive' });
        return;
    }
    
    setIsProcessing(true);
    toast({ title: 'Adding Page Numbers', description: 'This may take a moment...' });

    try {
        const existingPdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        const hex = settings.fontColor.replace(/^#/, '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        const textColor = rgb(r, g, b);

        for (let i = 0; i < totalPages; i++) {
            const page = pages[i];
            const { width, height } = page.getSize();
            const pageNumberText = settings.format
                .replace('{page}', String(i + 1))
                .replace('{total}', String(totalPages));
            
            const textWidth = font.widthOfTextAtSize(pageNumberText, settings.fontSize);

            let x: number, y: number;

            switch(settings.position) {
                case 'top_left':
                    x = settings.margin;
                    y = height - settings.margin;
                    break;
                case 'top_center':
                    x = width / 2 - textWidth / 2;
                    y = height - settings.margin;
                    break;
                case 'top_right':
                    x = width - textWidth - settings.margin;
                    y = height - settings.margin;
                    break;
                case 'bottom_left':
                    x = settings.margin;
                    y = settings.margin;
                    break;
                case 'bottom_center':
                    x = width / 2 - textWidth / 2;
                    y = settings.margin;
                    break;
                case 'bottom_right':
                    x = width - textWidth - settings.margin;
                    y = settings.margin;
                    break;
            }

            page.drawText(pageNumberText, {
                x,
                y,
                font,
                size: settings.fontSize,
                color: textColor,
            });
        }
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `numbered-${pdfFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: 'Success!', description: 'Your numbered PDF has been downloaded.' });
    } catch(error) {
        console.error('Error adding page numbers:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            title: 'Failed',
            description: `Could not add page numbers. ${errorMessage}`,
            variant: 'destructive',
        });
    } finally {
        setIsProcessing(false);
    }
  }, [pdfFile, settings, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Hash className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Add Page Numbers</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Insert page numbers into your PDF</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>1. Upload Your PDF</CardTitle>
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
        </div>

        <aside className="space-y-6">
          <AdBanner type="vertical" />
          <NumberSettings settings={settings} onSettingsChange={setSettings} disabled={!pdfFile || isProcessing} />
          <Button onClick={handleAddNumbers} disabled={!pdfFile || isProcessing} className="w-full text-lg py-6">
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
              {isProcessing ? 'Processing...' : 'Add Numbers & Download'}
          </Button>
        </aside>
      </main>
    </div>
  );
}
