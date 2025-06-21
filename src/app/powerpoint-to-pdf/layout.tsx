
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter',
  description: 'Convert your PowerPoint presentations (.pptx) into PDF files.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
