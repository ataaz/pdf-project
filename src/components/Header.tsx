
"use client";

import React from 'react';
import Link from 'next/link';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Grid2X2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-6xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Grid2X2 className="h-6 w-6 text-primary" />
            <span className="font-bold">PDFry</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Organize PDF</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/merge-pdf">Merge PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/split-pdf">Split PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/organize-pdf">Organize PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/add-page-numbers">Add Page Numbers</Link></MenubarItem>
                <MenubarItem asChild><Link href="/rotate-pdf">Rotate PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/crop-pdf">Crop PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Optimize PDF</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/compress-pdf">Compress PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/repair-pdf">Repair PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Convert to PDF</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/jpg-to-pdf">JPG to PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/word-to-pdf">Word to PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/powerpoint-to-pdf">PowerPoint to PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/excel-to-pdf">Excel to PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/html-to-pdf">HTML to PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/scan-to-pdf">Scan to PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Convert from PDF</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/pdf-to-jpg">PDF to JPG</Link></MenubarItem>
                <MenubarItem asChild><Link href="/pdf-to-word">PDF to Word</Link></MenubarItem>
                <MenubarItem asChild><Link href="/pdf-to-powerpoint">PDF to PowerPoint</Link></MenubarItem>
                <MenubarItem asChild><Link href="/pdf-to-excel">PDF to Excel</Link></MenubarItem>
                <MenubarItem asChild><Link href="/pdf-to-pdfa">PDF to PDF/A</Link></MenubarItem>
                <MenubarItem asChild><Link href="/ocr-pdf">OCR PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Edit PDF</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/edit-pdf">Edit PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/redact-pdf">Redact PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/sign-pdf">Sign PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/watermark-pdf">Watermark PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger>PDF Security</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild><Link href="/protect-pdf">Protect PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/unlock-pdf">Unlock PDF</Link></MenubarItem>
                <MenubarItem asChild><Link href="/compare-pdf">Compare PDF</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
};

export default Header;
