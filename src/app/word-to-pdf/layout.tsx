
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word to PDF Converter',
  description: 'Convert your Word documents (.docx) to professional PDF files.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
