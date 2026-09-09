import './globals.css'
import Script from 'next/script'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CursorGlow from '@/components/ui/CursorGlow'

export const metadata = {
  title: 'Ganesh Bakkera | AI & ML Engineer · Full Stack Developer',
  description:
    'Portfolio of Ganesh Bakkera — AI/ML Engineer and Full Stack Developer building AI-powered products and full-stack systems with Python, FastAPI, React and PostgreSQL.',
  keywords: ['Ganesh Bakkera', 'AI Engineer', 'Machine Learning', 'Full Stack Developer', 'Python', 'FastAPI', 'LLM', 'NLP'],
  authors: [{ name: 'Ganesh Bakkera' }],
  icons: { icon: '/favicon.svg' }
}

export const viewport = {
  themeColor: '#07070f'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){var t;try{t=localStorage.getItem('portfolio.theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark'}document.documentElement.setAttribute('data-theme',t)})()`}
        </Script>
        <SmoothScroll>
          <Loader />
          <CursorGlow />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}