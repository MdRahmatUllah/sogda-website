import type { ReactNode } from 'react';
import './globals.css';

// Each locale renders its own <html lang> (app/[locale]/layout.tsx); the root
// only passes through, as next-intl's static export expects.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
