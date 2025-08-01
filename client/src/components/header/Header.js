import React, { Fragment, memo, useEffect, useState } from 'react'
import logo from '../../assets/logo_digital.png'
import icons from '../../utils/icons'
import { Link } from 'react-router-dom'
import path from '../../utils/path'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from 'store/user/userSlice'
import { AiOutlineLogout } from 'react-icons/ai'
import { showCart } from 'store/appSlice'

const { RiPhoneFill, MdEmail, FaCartShopping, FaUser } = icons;

const Header = () => {

    const { current } = useSelector(state => state.user)
    const [option, setOption] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        const handleClickOutside = (event) => {
            const profileElement = document.getElementById('profile')
            if (!profileElement?.contains(event.target)) {
                setOption(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className=' w-main flex select-none justify-between h-[110px] py-[35px]'>
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

                {current && <Fragment>
                    <div onClick={() => dispatch(showCart({ isShowCart: true }))} className='flex items-center justify-center gap-2 px-6 font-semibold border-r cursor-pointer select-none'>
                        <FaCartShopping color='red' />
                        <span>{`Giỏ hàng (${current?.cart?.length})`}</span>
                    </div>
                    <div
                        id='profile'
                        className='relative flex items-center justify-center gap-2 px-6 font-semibold cursor-pointer select-none'
                        onClick={() => setOption(!option)}
                    >
                        <FaUser color='red' />
                        <span>Profile</span>
                        {option &&
                            <div onClick={(e) => e.stopPropagation()} className='absolute left-0 z-10 p-2 min-w-[150px] bg-gray-100 py-2 border rounded-md shadow-md top-full'>
                                <Link
                                    className='flex w-full px-4 py-2 rounded-md hover:bg-gray-300'
                                    to={`${path.MEMBER}/${path.PERSONAL}`}
                                >Cá nhân</Link>
                                {current?.role === 3108 && <Link
                                    className='flex w-full px-4 py-2 rounded-md hover:bg-gray-300'
                                    to={`${path.ADMIN}/${path.DASHBOARD}`}
                                >Quản lý</Link>}
                                <span
                                    onClick={() => dispatch(logout())}
                                    className='flex w-full px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300'>
                                    <span className='mr-2'>Đăng xuất</span>
                                    <AiOutlineLogout size={18} />
                                </span>
                            </div>
                        }
                    </div>
                </Fragment>}
            </div>
        </div>
    )
}

export default memo(Header)