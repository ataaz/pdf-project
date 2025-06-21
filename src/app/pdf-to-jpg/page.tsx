
"use client";

import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdBanner } from '@/components/AdBanner';

// Set worker source for pdfjs from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface GeneratedImage {
  src: string;
  name: string;
}

export default function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
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
    setGeneratedImages([]);
  };

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setGeneratedImages([]);
    setProgress(0);
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
    setProgress(0);
    setGeneratedImages([]);
    toast({ title: 'Conversion Started', description: 'Generating JPG images from your PDF...' });

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const images: GeneratedImage[] = [];
      const baseFileName = pdfFile.name.replace(/\.[^/.]+$/, "");

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Quality setting
          images.push({ src: imageDataUrl, name: `${baseFileName}-page-${i}.jpg` });
        }
        setProgress((i / numPages) * 100);
      }

      setGeneratedImages(images);
      toast({ title: 'Success!', description: `Generated ${images.length} JPG image(s).` });

    } catch (error) {
      console.error('PDF to JPG conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not convert the PDF. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, toast]);

  const downloadImage = (src: string, name: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadAllImages = async () => {
    if(generatedImages.length === 0) return;
    
    toast({ title: 'Downloading All', description: 'Your images will be downloaded one by one.'});
    
    for(let i=0; i<generatedImages.length; i++) {
        downloadImage(generatedImages[i].src, generatedImages[i].name);
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between downloads
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">PDF to JPG</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Convert each page of your PDF into a JPG image</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <AdBanner type="vertical" />
          <Card>
            <CardHeader>
              <CardTitle>1. Upload Your PDF</CardTitle>
              <CardDescription>Select the PDF file you want to convert.</CardDescription>
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
          
          <Card>
            <CardHeader>
              <CardTitle>2. Convert to JPG</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleConvert} disabled={!pdfFile || isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                {isProcessing ? 'Converting...' : 'Convert to JPG'}
              </Button>
              {isProcessing && (
                <div className="mt-4">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>3. Download Images</CardTitle>
                  <CardDescription>Your generated images will appear below.</CardDescription>
                </div>
                <Button onClick={downloadAllImages} disabled={generatedImages.length === 0 || isProcessing} size="sm">
                  <Download className="mr-2 h-4 w-4"/>
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] p-4 border rounded-md">
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generatedImages.map((image, index) => (
                      <div key={index} className="relative group border rounded-lg overflow-hidden">
                        <Image src={image.src} alt={image.name} width={300} height={400} className="w-full h-auto object-contain" data-ai-hint="document page" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" onClick={() => downloadImage(image.src, image.name)}>
                            <Download className="mr-2 h-4 w-4"/> Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Images will appear here after conversion.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
