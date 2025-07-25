import React from 'react'
import logo from '../assets/logo_digital.png'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'
import path from '../utils/path'

const { RiPhoneFill, MdEmail, FaCartShopping, FaUser } = icons;

const Header = () => {
    return (
        <div className=' w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt='logo' className='w-[234px] object-contain' />
            </Link>
            <div className='flex text-[13px] '>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex items-center gap-4 '>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold'>0918516514</span>
                    </span>
                    <span>Thứ 2-Thứ 7 9:00 - 20:00</span>
                </div>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex items-center gap-4 '>
                        <MdEmail color='red' />
                        <span className='font-semibold'>SUPPORT@DUKESHOP.COM</span>
                    </span>
                    <span>Hỗ Trợ 24/7</span>
                </div>
                <div className='flex items-center justify-center gap-2 px-6 border-r cursor-pointer'>
                    <FaCartShopping color='red' />
                    <span>0 item(s)</span>
                </div>
                <div className='flex items-center justify-center gap-2 px-6 cursor-pointer'>
                    <FaUser color='red' />
                    <span>Profile</span>
                </div>
            </div>
        </div>
    )
}

export default Header