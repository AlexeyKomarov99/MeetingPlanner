import './global.css'
import HeaderWrapper from '../components/ui/HeaderWrapper'
import FooterWrapper from '../components/ui/FooterWrapper'
import ThemeProvider from '../components/ui/ThemeProvider'

export const metadata = {
  title: 'Meeting Planner',
  description: 'Plan your meetings efficiently', 
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <HeaderWrapper />
          <main className="pt-20 pb-24">
            <div className="min-h-[calc(100vh-140px)]">
              {children}
            </div>
          </main>
          <FooterWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}