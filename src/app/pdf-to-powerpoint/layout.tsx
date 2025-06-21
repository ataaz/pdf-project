
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter',
  description: 'Generate an editable PowerPoint presentation (PPTX) from your PDF using AI.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
