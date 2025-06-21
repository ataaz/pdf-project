"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileText, UploadCloud, Loader2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function WordToPdfPage() {
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a Word (.docx) file.',
        variant: 'destructive',
      });
      return;
    }
    setWordFile(file);
  };

  const handleReset = useCallback(() => {
    setWordFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!wordFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a Word file to convert.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Converting to PDF', description: 'This may take a moment...' });

    try {
      // Dynamically import libraries
      const mammoth = await import('mammoth');
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const arrayBuffer = await wordFile.arrayBuffer();

      // Convert DOCX to HTML
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      // Create a hidden element to render the HTML
      const renderContainer = document.createElement('div');
      renderContainer.innerHTML = html;
      renderContainer.style.position = 'absolute';
      renderContainer.style.width = '210mm'; // A4 width
      renderContainer.style.padding = '15mm';
      renderContainer.style.left = '-9999px'; // Move off-screen
      renderContainer.style.boxSizing = 'border-box';
      renderContainer.style.background = '#fff';
      document.body.appendChild(renderContainer);
      
      // Render the hidden element to a canvas
      const canvas = await html2canvas(renderContainer, {
          scale: 2, // Improve quality
          useCORS: true,
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
      const canvasAspectRatio = canvasWidth / canvasHeight;
      
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let finalCanvasHeight, finalCanvasWidth;

      if (canvasAspectRatio > pdfAspectRatio) {
        finalCanvasWidth = pdfWidth;
        finalCanvasHeight = pdfWidth / canvasAspectRatio;
      } else {
        finalCanvasHeight = pdfHeight;
        finalCanvasWidth = pdfHeight * canvasAspectRatio;
      }

      const totalPDFPages = Math.ceil(canvasHeight / (canvasWidth / finalCanvasWidth * (pdfHeight / pdfWidth)));
      let position = 0;
      
      for (let i = 0; i < totalPDFPages; i++) {
        if (i > 0) pdf.addPage();
        const srcY = position;
        pdf.addImage(canvas, 'PNG', 0, srcY, canvas.width, canvas.height, undefined, 'FAST');
        position += pdfHeight;
      }

      const pdfFileName = wordFile.name.replace(/\.docx$/i, '.pdf');
      pdf.save(pdfFileName);

      toast({
        title: 'Success!',
        description: `Your PDF "${pdfFileName}" has been downloaded.`,
      });

    } catch (error) {
      console.error('Word to PDF conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not convert the file. Note: This converter has limited support for complex styles and layouts. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [wordFile, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Word to PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Convert .docx documents to PDF files</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-start gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>1. Upload Your Document</CardTitle>
            <CardDescription>Select a Word (.docx) file.</CardDescription>
          </CardHeader>
          <CardContent>
            {!wordFile ? (
              <div
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={isProcessing}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                  <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm font-medium truncate" title={wordFile.name}>
                    {wordFile.name}
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
            <CardTitle>2. Convert to PDF</CardTitle>
            <CardDescription>Click the button to start the conversion process.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConvert} disabled={!wordFile || isProcessing} className="w-full text-lg py-6">
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? 'Converting...' : 'Convert & Download PDF'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Conversion is done in your browser. Styles and complex layouts may have limited support.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
