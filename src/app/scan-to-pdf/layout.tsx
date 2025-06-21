
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan to PDF',
  description: 'Use your camera to scan documents and save them as a single PDF file.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
