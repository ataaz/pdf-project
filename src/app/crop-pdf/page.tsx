"use client";

import React from 'react';
import { Crop } from 'lucide-react';

export default function CropPdfPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Crop className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Crop PDF</h1>
            <p className="text-lg text-muted-foreground">Adjust the visible area of pages.</p>
          </div>
        </div>
      </header>
       <main className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Feature Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            Get ready to trim the margins and adjust the visible area of your PDF pages. This feature is currently being developed and will be available soon.
          </p>
      </main>
    </div>
  );
}
