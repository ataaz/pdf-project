
"use client";

import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileCode, Loader2, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AdBanner } from '@/components/AdBanner';

export default function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleReset = useCallback(() => {
    setHtmlContent('');
  }, []);

  const handleConvert = useCallback(async () => {
    if (!htmlContent.trim()) {
      toast({
        title: 'No HTML Content',
        description: 'Please enter some HTML code to convert.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Converting HTML to PDF', description: 'This may take a moment...' });

    try {
      // Dynamically import libraries
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Create a hidden element to render the HTML
      const renderContainer = document.createElement('div');
      renderContainer.innerHTML = htmlContent;
      renderContainer.style.position = 'absolute';
      renderContainer.style.width = '210mm'; // A4 width
      renderContainer.style.padding = '15mm';
      renderContainer.style.left = '-9999px'; // Move off-screen
      renderContainer.style.boxSizing = 'border-box';
      renderContainer.style.background = '#fff';
      renderContainer.style.color = '#000';
      document.body.appendChild(renderContainer);
      
      // Render the hidden element to a canvas
      const canvas = await html2canvas(renderContainer, {
          scale: 2, // Improve quality
          useCORS: true,
          width: renderContainer.scrollWidth,
          height: renderContainer.scrollHeight,
          windowWidth: renderContainer.scrollWidth,
          windowHeight: renderContainer.scrollHeight,
      });

      // Clean up the hidden element
      document.body.removeChild(renderContainer);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
      
      const totalPDFPages = Math.ceil(imgHeight / pdfHeight);
      
      for (let i = 0; i < totalPDFPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        const yPosition = -(pdfHeight * i);
        pdf.addImage(imgData, 'PNG', 0, yPosition, pdfWidth, imgHeight);
      }

      pdf.save('html-content.pdf');

      toast({
        title: 'Success!',
        description: `Your PDF has been downloaded.`,
      });

    } catch (error) {
      console.error('HTML to PDF conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not convert the HTML. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [htmlContent, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FileCode className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">HTML to PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Convert HTML code to a PDF document</p>
          </div>
        </div>
      </header>
      <AdBanner className="my-8" />
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>1. Paste Your HTML</CardTitle>
                            <CardDescription>Enter the HTML code you want to convert below.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleReset} disabled={!htmlContent || isProcessing}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="<html>...</html>"
                        className="min-h-[400px] font-mono text-sm"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        disabled={isProcessing}
                    />
                </CardContent>
            </Card>
        </div>
        
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>2. Convert to PDF</CardTitle>
                    <CardDescription>Click the button to generate your PDF file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleConvert} disabled={!htmlContent.trim() || isProcessing} className="w-full text-lg py-6">
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-5 w-5" />
                    )}
                    {isProcessing ? 'Converting...' : 'Convert & Download PDF'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                    Note: Complex CSS and external resources might not render correctly. For best results, use inline styles.
                    </p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
