import type { Metadata } from 'next'
import { IBM_Plex_Sans, Unbounded, Space_Mono, Newsreader } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/auth-context'
import { WalletProvider } from '@/context/wallet-context'
import './globals.css'

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Unbounded({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const serif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VoxHealth — Voice-First Medical Record on Solana',
  description:
    'Speak your symptoms. Encrypt on a Ledger. Settle to Solana. Share with any doctor via QR. The first patient-owned medical record built on voice.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="font-sans antialiased bg-paper text-ink">
        <AuthProvider>
          <WalletProvider>{children}</WalletProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
