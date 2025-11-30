import './global.css'
import HeaderWrapper from '../components/ui/HeaderWrapper'

export const metadata = {
  title: 'Meeting Planner',
  description: 'Plan your meetings efficiently', 
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <HeaderWrapper />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}