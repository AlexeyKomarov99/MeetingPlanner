import './globals.css'

export const metadata = {
  title: 'Meeting Planner',
  description: 'Plan your meetings efficiently', 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}