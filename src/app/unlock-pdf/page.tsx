
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Unlock, UploadCloud, Loader2, FileText, Trash2, Download, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';

export default function UnlockPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
  };

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setPassword('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleUnlockPdf = useCallback(async () => {
    if (!pdfFile) {
        toast({ title: 'No File', description: 'Please upload a PDF file to unlock.', variant: 'destructive' });
        return;
    }
     if (!password) {
        toast({ title: 'No Password', description: 'Please enter the password for the PDF.', variant: 'destructive' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Unlocking PDF', description: 'Attempting to remove password...' });

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      // Try to load the document with the provided password.
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
        password: password,
        ignoreEncryption: false // We need to handle encryption
      });

      // If loading is successful, the password was correct.
      // Now, save the document without a password.
      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `unlocked-${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ 
        title: 'Success!', 
        description: `Your unlocked PDF has been downloaded.`
      });
      handleReset();
      
    } catch (error) {
      console.error('PDF unlocking error:', error);
      let errorMessage = 'Could not unlock the PDF. Please double-check your password.';
      if (error instanceof Error && error.message.includes('password')) {
        errorMessage = 'Invalid password or unsupported encryption.';
      }
      toast({
        title: 'Unlocking Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, password, toast, handleReset]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Unlock className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Unlock PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Remove password protection from your PDF</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-start gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>1. Upload Your Locked PDF</CardTitle>
            <CardDescription>Select the password-protected PDF file.</CardDescription>
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
        
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>2. Enter Password</CardTitle>
            <CardDescription>Provide the password to unlock the document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="password">PDF Password</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!pdfFile || isProcessing}
                        className="pl-10"
                    />
                </div>
            </div>
            <Button onClick={handleUnlockPdf} disabled={!pdfFile || !password || isProcessing} className="w-full text-lg py-6">
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Unlock className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? 'Unlocking...' : 'Unlock & Download'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
