
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - PDFry',
  description: 'Insights, tips, and updates on PDF management, conversion, and optimization from the PDFry team.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
