import React from 'react'

const layout = ({children,}: Readonly<{children: React.ReactNode;}>) => {
  return (
    <div>
      <h1>nav</h1>
      {/* the pages are the children within our layout */}
      {children}
    </div>
  )
}

export default layout