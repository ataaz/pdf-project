
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel to PDF Converter',
  description: 'Convert your Excel spreadsheets (.xlsx, .xls) to PDF documents with ease.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
