
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Grid2X2, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
    {
        title: 'Organize PDF',
        items: [
            { href: '/merge-pdf', label: 'Merge PDF' },
            { href: '/split-pdf', label: 'Split PDF' },
            { href: '/organize-pdf', label: 'Organize PDF' },
            { href: '/add-page-numbers', label: 'Add Page Numbers' },
            { href: '/rotate-pdf', label: 'Rotate PDF' },
            { href: '/crop-pdf', label: 'Crop PDF' },
        ],
    },
    {
        title: 'Optimize PDF',
        items: [
            { href: '/compress-pdf', label: 'Compress PDF' },
            { href: '/repair-pdf', label: 'Repair PDF' },
        ],
    },
    {
        title: 'Convert to PDF',
        items: [
            { href: '/jpg-to-pdf', label: 'JPG to PDF' },
            { href: '/word-to-pdf', label: 'Word to PDF' },
            { href: '/powerpoint-to-pdf', label: 'PowerPoint to PDF' },
            { href: '/excel-to-pdf', label: 'Excel to PDF' },
            { href: '/html-to-pdf', label: 'HTML to PDF' },
            { href: '/scan-to-pdf', label: 'Scan to PDF' },
        ],
    },
    {
        title: 'Convert from PDF',
        items: [
            { href: '/pdf-to-jpg', label: 'PDF to JPG' },
            { href: '/pdf-to-word', label: 'PDF to Word' },
            { href: '/pdf-to-powerpoint', label: 'PDF to PowerPoint' },
            { href: '/pdf-to-excel', label: 'PDF to Excel' },
            { href: '/pdf-to-pdfa', label: 'PDF to PDF/A' },
            { href: '/ocr-pdf', label: 'OCR PDF' },
            { href: '/pdf-text-summarizer', label: 'PDF Summarizer' },
        ],
    },
    {
        title: 'Edit PDF',
        items: [
            { href: '/edit-pdf', label: 'Edit PDF' },
            { href: '/redact-pdf', label: 'Redact PDF' },
            { href: '/sign-pdf', label: 'Sign PDF' },
            { href: '/watermark-pdf', label: 'Watermark PDF' },
        ],
    },
    {
        title: 'PDF Security',
        items: [
            { href: '/protect-pdf', label: 'Protect PDF' },
            { href: '/unlock-pdf', label: 'Unlock PDF' },
            { href: '/compare-pdf', label: 'Compare PDF' },
        ],
    },
];

const DesktopNav = () => (
  <nav className="hidden md:flex">
    <Menubar>
      {navLinks.map((group) => (
        <MenubarMenu key={group.title}>
          <MenubarTrigger>{group.title}</MenubarTrigger>
          <MenubarContent>
            {group.items.map((item) => (
              <MenubarItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  </nav>
);

const MobileNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle asChild>
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Grid2X2 className="h-6 w-6 text-primary" />
                <span className="font-bold">PDFry</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <Accordion type="single" collapsible className="w-full">
              {navLinks.map((group) => (
                <AccordionItem key={group.title} value={group.title}>
                  <AccordionTrigger>{group.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-1 pl-4">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="p-2 rounded-md hover:bg-accent"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};


const Navigation = () => {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  ) : (
    // Render a placeholder on the server to prevent hydration mismatch
    <div className="h-9 w-24 rounded-md animate-pulse bg-muted" />
  );
};


const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 justify-center flex">
      <div className="container flex h-14 max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Grid2X2 className="h-6 w-6 text-primary" />
          <span className="font-bold">PDFry</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
