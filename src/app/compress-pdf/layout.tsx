
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF',
  description: 'Reduce the file size of your PDF documents quickly while maintaining the best possible quality.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
