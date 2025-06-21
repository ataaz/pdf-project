
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF',
  description: 'Rotate one or all pages in your PDF document permanently.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
