import './global.css'
import HeaderWrapper from '../components/ui/HeaderWrapper'
import FooterWrapper from '../components/ui/FooterWrapper'

export const metadata = {
  title: 'Meeting Planner',
  description: 'Plan your meetings efficiently', 
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <HeaderWrapper />
        <main className="flex-1">
          <div className="min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </main>
        <FooterWrapper />
      </body>
    </html>
  )
}