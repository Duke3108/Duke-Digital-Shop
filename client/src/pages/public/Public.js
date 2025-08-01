import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer, Header, Navigation, TopHeader } from '../../components'

const Public = () => {
  const containerRef = useRef()
  const location = useLocation()

  // Lưu vị trí cuộn trang khi người dùng cuộn
  useEffect(() => {
    const saveScrollPosition = () => {
      if (containerRef.current) {
        sessionStorage.setItem(location.pathname, containerRef.current.scrollTop)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', saveScrollPosition)
    }
    // Xóa sự kiện khi component unmount để tránh rò rỉ bộ nhớ
    return () => {
      if (container) {
        container.removeEventListener('scroll', saveScrollPosition)
      }
    }
  }, [location.pathname])

  useEffect(() => {
    const storedPosition = sessionStorage.getItem(location.pathname)
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollTo({
          top: storedPosition ? parseInt(storedPosition) : 0,
          behavior: 'smooth',
        })
      }, 100) // Delay để đảm bảo nội dung đã render xong
    }
  }, [location])

  return (
    <div ref={containerRef}
      className='flex flex-col items-center w-full max-h-screen overflow-y-auto'>
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