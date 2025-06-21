
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  FileImage, Combine, Spline, Minimize2, FileText, Presentation, Table2Icon,
  Edit3, Image as ImageIcon, PenTool, Droplets, RotateCw, FileCode, Unlock, Lock,
  FolderKanban, FileArchive, Wrench, Hash, ScanLine, ScanSearch, GitCompareArrows,
  SquareSlash, Crop, Grid2X2
} from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

interface Tool {
  name: string;
  icon: React.ElementType;
  href: string;
  description: string;
  bgColorClass?: string;
  textColorClass?: string;
}

const tools: Tool[] = [
  { name: 'JPG to PDF', icon: FileImage, href: '/jpg-to-pdf', description: 'Convert JPG images to PDF files.', bgColorClass: 'bg-blue-500/10', textColorClass: 'text-blue-600' },
  { name: 'Merge PDF', icon: Combine, href: '/merge-pdf', description: 'Combine multiple PDF files into one.', bgColorClass: 'bg-green-500/10', textColorClass: 'text-green-600' },
  { name: 'Split PDF', icon: Spline, href: '/split-pdf', description: 'Extract pages or split a PDF.', bgColorClass: 'bg-yellow-500/10', textColorClass: 'text-yellow-600' },
  { name: 'Compress PDF', icon: Minimize2, href: '/compress-pdf', description: 'Reduce the file size of your PDF.', bgColorClass: 'bg-purple-500/10', textColorClass: 'text-purple-600' },
  { name: 'PDF to Word', icon: FileText, href: '/pdf-to-word', description: 'Convert PDFs to Word documents.', bgColorClass: 'bg-sky-500/10', textColorClass: 'text-sky-600' },
  { name: 'PDF to PowerPoint', icon: Presentation, href: '/pdf-to-powerpoint', description: 'Convert PDFs to PowerPoint.', bgColorClass: 'bg-orange-500/10', textColorClass: 'text-orange-600' },
  { name: 'PDF to Excel', icon: Table2Icon, href: '/pdf-to-excel', description: 'Convert PDFs to Excel sheets.', bgColorClass: 'bg-teal-500/10', textColorClass: 'text-teal-600' },
  { name: 'Word to PDF', icon: FileText, href: '/word-to-pdf', description: 'Convert Word documents to PDF.', bgColorClass: 'bg-indigo-500/10', textColorClass: 'text-indigo-600' },
  { name: 'PowerPoint to PDF', icon: Presentation, href: '/powerpoint-to-pdf', description: 'Convert PowerPoint to PDF.', bgColorClass: 'bg-red-500/10', textColorClass: 'text-red-600' },
  { name: 'Excel to PDF', icon: Table2Icon, href: '/excel-to-pdf', description: 'Convert Excel sheets to PDF.', bgColorClass: 'bg-lime-500/10', textColorClass: 'text-lime-600' },
  { name: 'Edit PDF', icon: Edit3, href: '/edit-pdf', description: 'Modify and annotate PDFs.', bgColorClass: 'bg-pink-500/10', textColorClass: 'text-pink-600' },
  { name: 'PDF to JPG', icon: ImageIcon, href: '/pdf-to-jpg', description: 'Convert PDF pages to JPG images.', bgColorClass: 'bg-amber-500/10', textColorClass: 'text-amber-600' },
  { name: 'Sign PDF', icon: PenTool, href: '/sign-pdf', description: 'Add your signature to PDFs.', bgColorClass: 'bg-cyan-500/10', textColorClass: 'text-cyan-600' },
  { name: 'Watermark PDF', icon: Droplets, href: '/watermark-pdf', description: 'Add watermarks to your PDF files.', bgColorClass: 'bg-fuchsia-500/10', textColorClass: 'text-fuchsia-600' },
  { name: 'Rotate PDF', icon: RotateCw, href: '/rotate-pdf', description: 'Rotate pages in your PDF.', bgColorClass: 'bg-rose-500/10', textColorClass: 'text-rose-600' },
  { name: 'HTML to PDF', icon: FileCode, href: '/html-to-pdf', description: 'Convert HTML web pages to PDF.', bgColorClass: 'bg-emerald-500/10', textColorClass: 'text-emerald-600' },
  { name: 'Unlock PDF', icon: Unlock, href: '/unlock-pdf', description: 'Remove PDF password protection.', bgColorClass: 'bg-violet-500/10', textColorClass: 'text-violet-600' },
  { name: 'Protect PDF', icon: Lock, href: '/protect-pdf', description: 'Add password protection to PDFs.', bgColorClass: 'bg-true-gray-500/10', textColorClass: 'text-true-gray-600' },
  { name: 'Organize PDF', icon: FolderKanban, href: '/organize-pdf', description: 'Rearrange, delete, or add pages.', bgColorClass: 'bg-light-blue-500/10', textColorClass: 'text-light-blue-600' },
  { name: 'PDF to PDF/A', icon: FileArchive, href: '/pdf-to-pdfa', description: 'Convert PDFs to PDF/A for archiving.', bgColorClass: 'bg-warm-gray-500/10', textColorClass: 'text-warm-gray-600' },
  { name: 'Repair PDF', icon: Wrench, href: '/repair-pdf', description: 'Attempt to repair corrupted PDFs.', bgColorClass: 'bg-blue-gray-500/10', textColorClass: 'text-blue-gray-600' },
  { name: 'Add Page Numbers', icon: Hash, href: '/add-page-numbers', description: 'Insert page numbers into your PDF.', bgColorClass: 'bg-cool-gray-500/10', textColorClass: 'text-cool-gray-600' },
  { name: 'Scan to PDF', icon: ScanLine, href: '/scan-to-pdf', description: 'Convert scanned documents to PDF.', bgColorClass: 'bg-gray-500/10', textColorClass: 'text-gray-600' },
  { name: 'OCR PDF', icon: ScanSearch, href: '/ocr-pdf', description: 'Make scanned PDFs searchable.', bgColorClass: 'bg-red-400/10', textColorClass: 'text-red-500' },
  { name: 'Compare PDF', icon: GitCompareArrows, href: '/compare-pdf', description: 'Compare two PDF files.', bgColorClass: 'bg-yellow-400/10', textColorClass: 'text-yellow-500' },
  { name: 'Redact PDF', icon: SquareSlash, href: '/redact-pdf', description: 'Permanently remove content.', bgColorClass: 'bg-green-400/10', textColorClass: 'text-green-500' },
  { name: 'Crop PDF', icon: Crop, href: '/crop-pdf', description: 'Adjust the visible area of pages.', bgColorClass: 'bg-blue-400/10', textColorClass: 'text-blue-500' },
];

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center mb-3">
           <Grid2X2 className="h-12 w-12 text-primary mr-3" />
           <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">PDFry</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          All the PDF tools you need, in one place. Easy, fast, and free.
        </p>
      </header>

      <AdBanner className="mb-8" />

      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {tools.map((tool) => (
            <Link
              href={tool.href}
              key={tool.name}
              className="block h-full transform transition-all duration-300 ease-out hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <Card className={`h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 border ${tool.bgColorClass ? tool.bgColorClass.replace('/10', '/20') : 'border-border'}`}>
                <CardHeader className="items-center text-center p-4">
                  <div className={`p-3 rounded-full mb-3 inline-block ${tool.bgColorClass || 'bg-primary/10'}`}>
                    <tool.icon className={`h-8 w-8 ${tool.textColorClass || 'text-primary'}`} />
                  </div>
                  <CardTitle className={`text-lg font-semibold ${tool.textColorClass || 'text-foreground'}`}>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-4 pt-0">
                  <CardDescription className="text-sm text-muted-foreground">{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
