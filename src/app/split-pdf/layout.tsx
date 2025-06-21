
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF',
  description: 'Extract one or more pages from a PDF file to create a new document.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
