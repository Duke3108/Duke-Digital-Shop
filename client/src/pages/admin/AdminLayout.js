import { AdminSidebar } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'utils/path'

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current || current.role !== 3108) {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />
    }
    return (
        <div className='relative flex w-full min-h-screen bg-gray-200'>
            <div className='w-[327px] fixed top-0 bottom-0 flex-none'>
                <AdminSidebar />
            </div>
            <div className='w-[327px]'>
            </div>
            <div className='flex-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
