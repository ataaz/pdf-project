
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF',
  description: 'Remove password protection from your PDF files if you know the password.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
