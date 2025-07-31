import { MemberSidebar } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'utils/path'

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current) {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />
    }
    return (
        <div className='flex h-screen'>
            <MemberSidebar />
            <div className='flex-auto min-h-screen bg-gray-200'>
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout
