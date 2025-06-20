"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { UploadedImage, PdfOrientation, PdfMargin } from '@/lib/types';
import { ImageUploadArea } from '@/components/jpg2pdf-swift/ImageUploadArea';
import { ImagePreviewList } from '@/components/jpg2pdf-swift/ImagePreviewList';
import { PdfSettings } from '@/components/jpg2pdf-swift/PdfSettings';
import { AiSuggestionCard } from '@/components/jpg2pdf-swift/AiSuggestionCard';
import { ActionButtons } from '@/components/jpg2pdf-swift/ActionButtons';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';

export default function JpgToPdfPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [pdfOrientation, setPdfOrientation] = useState<PdfOrientation>('portrait');
  const [pdfMargin, setPdfMargin] = useState<PdfMargin>('small');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesAdded = useCallback(async (files: File[]) => {
    const newImagesPromises = files.map(async (file) => {
      const dataUrl = await fileToDataUrl(file);
      return {
        id: crypto.randomUUID(),
        file,
        dataUrl,
        name: file.name,
      };
    });
    const newImages = await Promise.all(newImagesPromises);
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    toast({
      title: `${newImages.length} image(s) added successfully!`,
      description: 'You can now reorder them or adjust PDF settings.',
    });
  }, [toast]);

  const handleReorderImages = (newImages: UploadedImage[]) => {
    setUploadedImages(newImages);
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prevImages) => prevImages.filter((img) => img.id !== id));
    toast({
      title: 'Image removed',
      description: 'The selected image has been removed from the list.',
    });
  };

  const handleConvertAndDownload = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: 'No Images to Convert',
        description: 'Please upload JPG images first.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: 'Conversion Started',
      description: 'Your PDF is being generated...',
    });

    // Simulate PDF conversion
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock PDF content
    const pdfContent = `
      JPG2PDF Swift - Mock PDF Document
      ---------------------------------
      Generated at: ${new Date().toLocaleString()}

      Orientation: ${pdfOrientation}
      Margin: ${pdfMargin}

      Images included:
      ${uploadedImages.map((img, index) => `${index + 1}. ${img.name}`).join('\n')}

      --- This is a mock PDF file. ---
    `;
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jpg2pdf-swift_output.pdf'; // Simulate PDF download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsConverting(false);
    toast({
      title: 'Conversion Successful!',
      description: 'Your PDF has been downloaded.',
    });
  };

  if (!isClient) {
    return null; // Or a loading spinner, to avoid hydration errors
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center">
           <FileText className="h-12 w-12 text-primary mr-3" />
           <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">JPG2PDF Swift</h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          Convert JPG images to PDF in seconds. Easily adjust orientation and margins.
        </p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadArea onFilesAdded={handleFilesAdded} className="min-h-[200px]" />
          {uploadedImages.length > 0 && (
             <h2 className="text-2xl font-headline font-semibold mt-6">Uploaded Images ({uploadedImages.length})</h2>
          )}
          <ImagePreviewList
            images={uploadedImages}
            onReorder={handleReorderImages}
            onRemove={handleRemoveImage}
            className={uploadedImages.length > 0 ? "border rounded-lg shadow" : ""}
          />
        </div>

        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <PdfSettings
            orientation={pdfOrientation}
            onOrientationChange={setPdfOrientation}
            margin={pdfMargin}
            onMarginChange={setPdfMargin}
          />
          <AiSuggestionCard images={uploadedImages} />
          <ActionButtons
            onConvertAndDownload={handleConvertAndDownload}
            isConverting={isConverting}
            canConvert={uploadedImages.length > 0}
          />
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground py-6 border-t">
        <p>&copy; {new Date().getFullYear()} JPG2PDF Swift. All rights reserved.</p>
      </footer>
    </div>
  );
}
