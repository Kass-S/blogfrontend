import { NavbarComponent } from '@/components/NavbarComponent';
import React from 'react'

const layout = ({children,}: Readonly<{children: React.ReactNode;}>) => {
  return (
    <div>
      <NavbarComponent />
      {/* the pages are the children within our layout */}
      {children}
    </div>
  )
}

export default layout