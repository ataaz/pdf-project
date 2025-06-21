
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organize PDF',
  description: 'Rearrange, delete, rotate, or add pages to your PDF files with our simple organizer.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
