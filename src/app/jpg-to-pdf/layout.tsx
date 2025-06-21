
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter',
  description: 'Convert your JPG images into a single, easy-to-share PDF file.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
