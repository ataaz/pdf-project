
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Text Summarizer',
  description: 'Summarize the content of your PDF documents using AI.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
