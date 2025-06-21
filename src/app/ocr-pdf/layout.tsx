
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR PDF - Searchable PDF',
  description: 'Make your scanned PDFs searchable and selectable with our AI-powered Optical Character Recognition (OCR) tool.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
