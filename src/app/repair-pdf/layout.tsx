
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repair PDF',
  description: 'Attempt to repair and recover data from a damaged or corrupt PDF file.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
