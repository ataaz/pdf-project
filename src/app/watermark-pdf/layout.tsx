
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark PDF',
  description: 'Add a text or image watermark to your PDF documents to protect your work.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
