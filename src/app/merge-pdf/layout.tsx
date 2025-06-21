
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF',
  description: 'Combine multiple PDF files into one single document. Reorder files as needed.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
