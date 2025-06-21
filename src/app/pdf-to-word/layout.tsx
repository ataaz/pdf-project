
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Word Converter',
  description: 'Extract text and structure from your PDF into an editable Word document using AI.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
