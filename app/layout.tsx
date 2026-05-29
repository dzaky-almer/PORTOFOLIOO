import type { ReactNode } from 'react';
import { Inter, Anton } from 'next/font/google';
import SmoothScroll from './components/SmoothScroll';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
});

export const metadata = {
  title: 'Your Name — Developer',
  description: 'Student Developer at SMKN 1 Kota Bekasi',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable}`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}