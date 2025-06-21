
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit PDF',
  description: 'Annotate and modify your PDF files directly in your browser. Add text, highlights, and drawings.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
