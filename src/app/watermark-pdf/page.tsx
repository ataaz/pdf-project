
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Droplets, UploadCloud, Loader2, FileText, Trash2, Download, Image as ImageIcon, Type as TypeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { AdBanner } from '@/components/AdBanner';

type WatermarkPosition = 'center' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
type WatermarkType = 'text' | 'image';

export default function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [fontColor, setFontColor] = useState('#ff0000');
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<WatermarkPosition>('center');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePdfFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast({ title: 'Invalid File', description: 'Please upload a valid PDF file.', variant: 'destructive' });
      return;
    }
    setPdfFile(file);
  };
  
  const handleImageFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file (PNG, JPG).', variant: 'destructive' });
        return;
    }
    setWatermarkImage(file);
    if(watermarkImageUrl) URL.revokeObjectURL(watermarkImageUrl)
    setWatermarkImageUrl(URL.createObjectURL(file));
  };

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setWatermarkImage(null);
    if(watermarkImageUrl) URL.revokeObjectURL(watermarkImageUrl)
    setWatermarkImageUrl(null);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  }, [watermarkImageUrl]);

  const applyWatermark = useCallback(async () => {
    if (!pdfFile) {
        toast({ title: 'Missing PDF', description: 'Please upload a PDF file.', variant: 'destructive'});
        return;
    }
    if (watermarkType === 'text' && !watermarkText) {
        toast({ title: 'Missing Text', description: 'Please enter watermark text.', variant: 'destructive'});
        return;
    }
    if (watermarkType === 'image' && !watermarkImage) {
        toast({ title: 'Missing Image', description: 'Please upload a watermark image.', variant: 'destructive'});
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Applying Watermark', description: 'This may take a moment...'});

    try {
        const existingPdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
        
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let watermarkAsset: any;
        let watermarkDims = { width: 0, height: 0 };
        
        if (watermarkType === 'text') {
            watermarkDims = {
                width: font.widthOfTextAtSize(watermarkText, fontSize),
                height: font.heightAtSize(fontSize),
            }
        } else if (watermarkImage) {
            const imageBytes = await watermarkImage.arrayBuffer();
            if (watermarkImage.type === 'image/png') {
                 watermarkAsset = await pdfDoc.embedPng(imageBytes);
            } else {
                 watermarkAsset = await pdfDoc.embedJpg(imageBytes);
            }
            watermarkDims = watermarkAsset.size();
        }
        
        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();

            page.pushGraphicsState();
            
            let tx, ty;
            const padding = 20;

            switch(position) {
                case 'top_left':
                    tx = padding + watermarkDims.width / 2;
                    ty = height - padding - watermarkDims.height / 2;
                    break;
                case 'top_right':
                    tx = width - padding - watermarkDims.width / 2;
                    ty = height - padding - watermarkDims.height / 2;
                    break;
                case 'bottom_left':
                    tx = padding + watermarkDims.width / 2;
                    ty = padding + watermarkDims.height / 2;
                    break;
                case 'bottom_right':
                    tx = width - padding - watermarkDims.width / 2;
                    ty = padding + watermarkDims.height / 2;
                    break;
                case 'center':
                default:
                    tx = width / 2;
                    ty = height / 2;
            }

            page.translate(tx, ty);
            page.rotate(degrees(rotation));

            if (watermarkType === 'text') {
                const hex = fontColor.replace(/^#/, '');
                const r = parseInt(hex.substring(0, 2), 16) / 255;
                const g = parseInt(hex.substring(2, 4), 16) / 255;
                const b = parseInt(hex.substring(4, 6), 16) / 255;
                page.drawText(watermarkText, {
                    x: -watermarkDims.width / 2,
                    y: -watermarkDims.height / 2,
                    font,
                    size: fontSize,
                    color: rgb(r, g, b),
                    opacity,
                });
            } else {
                page.drawImage(watermarkAsset, {
                    x: -watermarkDims.width / 2,
                    y: -watermarkDims.height / 2,
                    width: watermarkDims.width,
                    height: watermarkDims.height,
                    opacity,
                });
            }
            page.popGraphicsState();
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `watermarked-${pdfFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: 'Success!', description: 'Your watermarked PDF has been downloaded.' });

    } catch (error) {
        console.error('Watermark error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ title: 'Failed', description: `Could not apply watermark. ${errorMessage}`, variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  }, [pdfFile, watermarkType, watermarkText, fontSize, fontColor, opacity, rotation, position, watermarkImage, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Droplets className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Watermark PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Add text or an image watermark to your PDF</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Upload PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!pdfFile ? (
                <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click or drag PDF to upload</p>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handlePdfFileChange(e.target.files)}
                    disabled={isProcessing}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                    <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm font-medium truncate" title={pdfFile.name}>{pdfFile.name}</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleReset} disabled={isProcessing}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove and start over
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <AdBanner type="vertical" className="hidden lg:flex" />
          <Card>
            <CardHeader>
                <CardTitle>2. Watermark Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text"><TypeIcon className="mr-2 h-4 w-4" />Text</TabsTrigger>
                        <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4" />Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="watermark-text">Watermark Text</Label>
                            <Input id="watermark-text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size</Label>
                                <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="font-color">Color</Label>
                                <Input id="font-color" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="p-1 h-10"/>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="image" className="space-y-4 pt-4">
                       {!watermarkImageUrl ? (
                        <div
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <UploadCloud className="w-8 h-8 text-muted-foreground" />
                            <p className="mt-2 text-xs text-center text-muted-foreground">Click or drag image to upload</p>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={(e) => handleImageFileChange(e.target.files)}
                                disabled={isProcessing}
                            />
                        </div>
                       ) : (
                        <div className="space-y-2">
                            <img src={watermarkImageUrl} alt="Watermark preview" className="max-h-24 w-full object-contain rounded border p-2 bg-slate-50" data-ai-hint="watermark" />
                            <Button variant="outline" size="sm" className="w-full" onClick={() => {setWatermarkImage(null); if(watermarkImageUrl) URL.revokeObjectURL(watermarkImageUrl); setWatermarkImageUrl(null);}}>
                                Remove Image
                            </Button>
                        </div>
                       )}
                    </TabsContent>
                </Tabs>

                <div className="space-y-4 pt-4 border-t mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="opacity">Opacity ({Math.round(opacity * 100)}%)</Label>
                        <Slider id="opacity" value={[opacity]} onValueChange={(v) => setOpacity(v[0])} min={0} max={1} step={0.05} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="rotation">Rotation ({rotation}°)</Label>
                        <Slider id="rotation" value={[rotation]} onValueChange={(v) => setRotation(v[0])} min={-180} max={180} step={5} />
                    </div>
                    <div className="space-y-2">
                        <Label>Position</Label>
                         <RadioGroup value={position} onValueChange={(v) => setPosition(v as WatermarkPosition)} className="grid grid-cols-3 gap-2">
                            <Label htmlFor="p-tl" data-state={position === 'top_left' ? 'checked' : 'unchecked'} className="block p-2 text-center border rounded-md cursor-pointer text-xs data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                <RadioGroupItem value="top_left" id="p-tl" className="sr-only" />
                                Top Left
                            </Label>
                             <Label htmlFor="p-c" data-state={position === 'center' ? 'checked' : 'unchecked'} className="block p-2 text-center border rounded-md cursor-pointer text-xs data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                <RadioGroupItem value="center" id="p-c" className="sr-only" />
                                Center
                            </Label>
                            <Label htmlFor="p-tr" data-state={position === 'top_right' ? 'checked' : 'unchecked'} className="block p-2 text-center border rounded-md cursor-pointer text-xs data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                <RadioGroupItem value="top_right" id="p-tr" className="sr-only" />
                                Top Right
                            </Label>
                            <Label htmlFor="p-bl" data-state={position === 'bottom_left' ? 'checked' : 'unchecked'} className="block p-2 text-center border rounded-md cursor-pointer text-xs data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                <RadioGroupItem value="bottom_left" id="p-bl" className="sr-only" />
                                Btm Left
                            </Label>
                            <Label htmlFor="p-br" data-state={position === 'bottom_right' ? 'checked' : 'unchecked'} className="block p-2 text-center border rounded-md cursor-pointer text-xs data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                <RadioGroupItem value="bottom_right" id="p-br" className="sr-only" />
                                Btm Right
                            </Label>
                        </RadioGroup>
                    </div>
                </div>

            </CardContent>
          </Card>
          
          <Button onClick={applyWatermark} disabled={isProcessing || !pdfFile} className="w-full text-lg py-6">
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
              {isProcessing ? 'Processing...' : 'Apply & Download'}
          </Button>
        </aside>
      </main>
    </div>
  );
}
