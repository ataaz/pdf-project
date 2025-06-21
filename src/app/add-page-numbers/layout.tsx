
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF',
  description: 'Insert page numbers into your PDF with customizable positions, formats, and styles.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
