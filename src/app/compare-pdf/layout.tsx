
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare PDF Files',
  description: 'Find differences between two PDF files. Upload your documents to see the changes highlighted.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
