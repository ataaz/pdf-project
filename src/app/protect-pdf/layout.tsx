
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protect PDF with Password',
  description: 'Add a password and encrypt your PDF file to keep sensitive data secure.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
