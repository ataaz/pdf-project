"use client";

import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { UploadedImage, PdfOrientation, PdfMargin } from '@/lib/types';
import { ImageUploadArea } from '@/components/jpg2pdf-swift/ImageUploadArea';
import { ImagePreviewList } from '@/components/jpg2pdf-swift/ImagePreviewList';
import { PdfSettings } from '@/components/jpg2pdf-swift/PdfSettings';
import { AiSuggestionCard } from '@/components/jpg2pdf-swift/AiSuggestionCard';
import { ActionButtons } from '@/components/jpg2pdf-swift/ActionButtons';
import { useToast } from '@/hooks/use-toast';
import { FileImage } from 'lucide-react';

export default function JpgToPdfPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [orientation, setOrientation] = useState<PdfOrientation>('portrait');
  const [margin, setMargin] = useState<PdfMargin>('small');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFilesAdded = useCallback((files: File[]) => {
    const newImagePromises = files.map(file => {
      return new Promise<UploadedImage>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          resolve({
            id: `${file.name}-${file.lastModified}`,
            file,
            dataUrl,
            name: file.name,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then(newImages => {
       setImages((prev) => [...prev, ...newImages]);
    }).catch(error => {
       console.error("Error reading files:", error);
       toast({
         title: "File Read Error",
         description: "There was an issue reading one or more image files.",
         variant: "destructive",
       });
    });
  }, [toast]);


  const handleReorder = useCallback((reorderedImages: UploadedImage[]) => {
    setImages(reorderedImages);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const generatePdf = useCallback(async () => {
    if (images.length === 0) {
      toast({
        title: 'No Images',
        description: 'Please upload some images first.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    toast({ title: 'Conversion Started', description: 'Generating your PDF...' });

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: 'a4',
      });

      const marginValues = {
        none: 0,
        small: 20,
        medium: 40,
        large: 60,
      };
      const pageMargin = marginValues[margin];

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - pageMargin * 2;
      const contentHeight = pageHeight - pageMargin * 2;

      for (let i = 0; i < images.length; i++) {
        const imgData = images[i].dataUrl;
        
        // This creates an in-memory image to get dimensions, avoiding DOM manipulation
        const img = new (globalThis.window ? window.Image : Object)();
        img.src = imgData;
        await new Promise(resolve => { img.onload = resolve });

        if (i > 0) {
          doc.addPage();
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        const aspectRatio = imgWidth / imgHeight;

        let pdfImgWidth = contentWidth;
        let pdfImgHeight = contentWidth / aspectRatio;

        if (pdfImgHeight > contentHeight) {
          pdfImgHeight = contentHeight;
          pdfImgWidth = contentHeight * aspectRatio;
        }

        const x = (pageWidth - pdfImgWidth) / 2;
        const y = (pageHeight - pdfImgHeight) / 2;

        doc.addImage(imgData, 'JPEG', x, y, pdfImgWidth, pdfImgHeight);
      }

      doc.save('converted-images.pdf');
      toast({ title: 'Success!', description: 'Your PDF has been downloaded.' });
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not generate PDF. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsConverting(false);
    }
  }, [images, orientation, margin, toast]);


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FileImage className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">JPG to PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Convert JPG images to a single PDF file</p>
          </div>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadArea onFilesAdded={handleFilesAdded} />
          {images.length > 0 && (
             <ImagePreviewList
                images={images}
                onReorder={handleReorder}
                onRemove={handleRemove}
              />
          )}
        </div>

        <aside className="space-y-6">
          <PdfSettings
            orientation={orientation}
            onOrientationChange={setOrientation}
            margin={margin}
            onMarginChange={setMargin}
          />
          <AiSuggestionCard images={images} />
           <ActionButtons
            onConvertAndDownload={generatePdf}
            isConverting={isConverting}
            canConvert={images.length > 0}
          />
        </aside>
      </main>
    </div>
  );
}
