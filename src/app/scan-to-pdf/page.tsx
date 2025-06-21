
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScanLine, Camera, Trash2, Download, Loader2, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { jsPDF } from 'jspdf';

interface CapturedImage {
  id: string;
  dataUrl: string;
}

export default function ScanToPdfPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCaptureImage = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImages(prev => [...prev, { id: `img-${Date.now()}`, dataUrl }]);
      toast({ title: 'Image Captured', description: `Page ${capturedImages.length + 1} added.` });
    }
  }, [capturedImages.length, toast]);

  const handleRemoveImage = (id: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDownloadPdf = useCallback(async () => {
    if (capturedImages.length === 0) {
      toast({ title: 'No Images', description: 'Please capture at least one image.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Creating PDF', description: 'This may take a moment...' });

    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI to update
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < capturedImages.length; i++) {
        const imgData = capturedImages[i].dataUrl;
        const img = new (window.Image)();
        img.src = imgData;
        await new Promise(resolve => { img.onload = resolve; });

        if (i > 0) doc.addPage();

        const imgWidth = img.width;
        const imgHeight = img.height;
        const aspectRatio = imgWidth / imgHeight;

        let pdfImgWidth = pageWidth;
        let pdfImgHeight = pageWidth / aspectRatio;

        if (pdfImgHeight > pageHeight) {
          pdfImgHeight = pageHeight;
          pdfImgWidth = pageHeight * aspectRatio;
        }

        const x = (pageWidth - pdfImgWidth) / 2;
        const y = (pageHeight - pdfImgHeight) / 2;

        doc.addImage(imgData, 'JPEG', x, y, pdfImgWidth, pdfImgHeight);
      }

      doc.save('scanned-document.pdf');
      toast({ title: 'Success!', description: 'Your scanned PDF has been downloaded.' });
    } catch (error) {
        console.error('PDF generation error:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ title: 'PDF Creation Failed', description: errorMessage, variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  }, [capturedImages, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ScanLine className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Scan to PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Use your camera to scan and create a PDF.</p>
          </div>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Camera Feed</CardTitle>
            <CardDescription>Position your document and capture images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <VideoOff className="h-12 w-12 mb-4"/>
                    <h3 className="text-lg font-semibold">Camera Access Required</h3>
                    <p className="text-sm text-center">Please allow camera access in your browser to use this feature.</p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button onClick={handleCaptureImage} disabled={!hasCameraPermission || isProcessing} className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Capture Page
              </Button>
              <Button onClick={handleDownloadPdf} disabled={capturedImages.length === 0 || isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isProcessing ? 'Creating PDF...' : 'Download PDF'}
              </Button>
            </div>
             {hasCameraPermission === null && (
                 <Alert>
                    <AlertTitle>Requesting Camera Access</AlertTitle>
                    <AlertDescription>
                        Please allow camera permission when prompted by your browser.
                    </AlertDescription>
                </Alert>
             )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Captured Pages</CardTitle>
            <CardDescription>Review and remove pages before creating your PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[380px] rounded-md border p-4">
              {capturedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {capturedImages.map((image, index) => (
                    <div key={image.id} className="relative group aspect-[3/4]">
                      <Image src={image.dataUrl} alt={`Captured page ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint="scanned document" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(image.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove page</span>
                        </Button>
                      </div>
                      <div className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Your captured pages will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
