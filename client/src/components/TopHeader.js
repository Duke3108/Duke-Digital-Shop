import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import path from '../utils/path'

const TopHeader = () => {
    return (
        <div className='h-[38px] w-full bg-main flex justify-center items-center'>
            <div className='flex items-center justify-between text-xs text-white w-main text'>
                <span>ĐẶT HÀNG TRỰC TUYẾN & LIÊN HỆ 0918516514</span>
                <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>Đăng Nhập & Tạo Tài Khoản</Link>
            </div>
        </div>
    )
}

export default memo(TopHeader)