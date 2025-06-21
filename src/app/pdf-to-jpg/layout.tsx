
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter',
  description: 'Convert each page of your PDF document into a high-quality JPG image.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
