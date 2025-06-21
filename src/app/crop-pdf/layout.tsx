
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop PDF',
  description: 'Adjust the visible area of your PDF pages. Easily crop margins from your document.',
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
