"use client";

import React from 'react';
import { ScanSearch } from 'lucide-react';

export default function OcrPdfPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <ScanSearch className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">OCR PDF</h1>
            <p className="text-lg text-muted-foreground">Make scanned PDFs searchable and selectable.</p>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Feature Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            This powerful tool is coming soon! You'll be able to turn your scanned PDFs into fully searchable documents with selectable text using Optical Character Recognition (OCR).
          </p>
      </main>
    </div>
  );
}
