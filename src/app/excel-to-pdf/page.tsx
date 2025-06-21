
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table2Icon, UploadCloud, Loader2, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ExcelToPdfPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an Excel (.xlsx, .xls) or CSV file.',
        variant: 'destructive',
      });
      return;
    }
    setExcelFile(file);
  };
  
  const handleReset = useCallback(() => {
    setExcelFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!excelFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload an Excel or CSV file to convert.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Converting to PDF', description: 'This may take a moment...' });

    try {
      // Dynamically import libraries to keep initial bundle size small
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const XLSX = await import('xlsx');

      const arrayBuffer = await excelFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('The selected sheet is empty or could not be read.');
      }

      const doc = new jsPDF({
        orientation: 'landscape' // Often better for wide tables
      });
      
      const head = [ (jsonData[0] as string[]).map(String) ];
      const body = (jsonData.slice(1) as any[][]).map(row => row.map(String));

      autoTable(doc, { head, body });

      const pdfFileName = excelFile.name.replace(/\.(xlsx|xls|csv)$/i, '.pdf');
      doc.save(pdfFileName);

      toast({
        title: 'Success!',
        description: `Your PDF "${pdfFileName}" has been downloaded.`,
      });

    } catch (error) {
      console.error('Excel to PDF conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Conversion Failed',
        description: `Could not convert the file. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [excelFile, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Table2Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Excel to PDF</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Convert spreadsheets to PDF documents</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>1. Upload Your Spreadsheet</CardTitle>
            <CardDescription>Select an Excel (.xlsx, .xls) or CSV file.</CardDescription>
          </CardHeader>
          <CardContent>
            {!excelFile ? (
              <div
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/70 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={isProcessing}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md">
                  <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm font-medium truncate" title={excelFile.name}>
                    {excelFile.name}
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
            <Button onClick={handleConvert} disabled={!excelFile || isProcessing} className="w-full text-lg py-6">
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? 'Converting...' : 'Convert & Download PDF'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              The first sheet of your document will be converted into a table in the PDF.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
