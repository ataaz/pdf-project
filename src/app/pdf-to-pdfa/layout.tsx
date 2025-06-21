
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to PDF/A Converter',
  description: 'Convert your PDF documents to the PDF/A format for long-term archiving.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
