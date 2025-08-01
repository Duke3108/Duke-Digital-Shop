import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../../store/user/asyncAction'
import { logout, clearMessage } from '../../store/user/userSlice'
import Swal from 'sweetalert2'

const TopHeader = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)

    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurrentUser())
            }
        }, 1000);
        return () => clearTimeout(setTimeoutId);
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (mes) {
            Swal.fire('Thông báo', mes, 'info').then(() => {
                dispatch(clearMessage())
                navigate(`/${path.HOME}`)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mes])

    return (
        <div className='h-[38px] py-4 w-full font-semibold bg-main flex justify-center items-center'>
            <div className='flex items-center justify-between text-xs text-white w-main text'>
                <span>ĐẶT HÀNG TRỰC TUYẾN & LIÊN HỆ 0918516514</span>

                {isLoggedIn && current
                    ? <div className='flex items-center justify-center gap-2 cursor-pointer'>
                        <span>{`Xin chào, ${current?.name}`}</span>
                        <span
                            onClick={() => dispatch(logout())}
                            className='p-2 hover:bg-gray-200 hover:rounded-full hover:text-main'>

                        </span>
                    </div>
                    : <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>Đăng Nhập & Tạo Tài Khoản</Link>}
            </div>
        </div>
    )
}

export default memo(TopHeader)