
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML to PDF Converter',
  description: 'Convert HTML code snippets or entire web pages into a professional PDF document.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
