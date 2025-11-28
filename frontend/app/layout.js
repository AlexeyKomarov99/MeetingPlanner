import './global.css'
import Header from "../components/ui/Header"

export const metadata = {
  title: 'Meeting Planner',
  description: 'Plan your meetings efficiently', 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}