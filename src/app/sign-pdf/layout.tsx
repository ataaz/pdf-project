
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign PDF',
  description: 'Add your digital signature to a PDF document online.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
