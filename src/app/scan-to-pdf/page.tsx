"use client";

import React from 'react';
import { ScanLine } from 'lucide-react';

export default function ScanToPdfPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
       <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <ScanLine className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Scan to PDF</h1>
            <p className="text-lg text-muted-foreground">Convert scanned documents to PDF.</p>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Feature Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            We're hard at work building this feature. Soon, you'll be able to connect your scanner or use your webcam to create PDF documents directly.
          </p>
      </main>
    </div>
  );
}
