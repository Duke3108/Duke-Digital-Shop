import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Header, Navigation, TopHeader } from '../../components'

const Public = () => {
  return (
    <div className='flex flex-col items-center w-full '>
      <TopHeader />
      <Header />
      <Navigation />

      <div className='flex flex-col items-center justify-center w-full'>
        <Outlet />
      </div>
      <div className='w-full'>
        <Footer />
      </div>
    </div>

  )
}

export default Public