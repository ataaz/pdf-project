
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redact PDF',
  description: 'Permanently remove sensitive text and content from your PDF documents.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
