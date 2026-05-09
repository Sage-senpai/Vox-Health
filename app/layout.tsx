import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context'
import { WalletProvider } from '@/context/wallet-context'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'VoxHealth - Your Voice-First Medical Journal',
  description: 'Manage your health journey with voice-first medical journaling, medication tracking, and secure doctor access.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
