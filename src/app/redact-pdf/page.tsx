"use client";

import React from 'react';
import { SquareSlash } from 'lucide-react';

export default function RedactPdfPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SquareSlash className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Redact PDF</h1>
            <p className="text-lg text-muted-foreground">Permanently remove sensitive content.</p>
          </div>
        </div>
      </header>
       <main className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Feature Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            A secure redaction tool is on its way. You will soon be able to permanently black out text and images to protect sensitive information in your documents.
          </p>
      </main>
    </div>
  );
}
