export const metadata = {
  title: 'Portfolio Feed v2',
  description: 'A personal portfolio feed powered by Next.js and MongoDB'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
