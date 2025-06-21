
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Excel Converter',
  description: 'Extract tables from your PDF files into editable Excel spreadsheets using AI.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
