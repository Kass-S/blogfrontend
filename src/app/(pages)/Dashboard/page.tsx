'use client'

import { loggedInData } from '@/utils/DataServices'
import React from 'react'

const page = () => {
  console.log(loggedInData());

  return (
    <div>
        <h1>Dashboard Page</h1>
    </div>
  )
}

export default page