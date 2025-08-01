import { apiUpdateCart } from 'apis'
import clsx from 'clsx'
import { BreadCrumb } from 'components'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'store/user/asyncAction'
import { formatMoney } from 'utils/helper'
import path from 'utils/path'

const DetailCart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [member, setMember] = useState(false)
    const { current } = useSelector(state => state.user)

    const handleQuantity = async (flag, pid, color, quantity) => {
        if (flag === '+') {
            await apiUpdateCart({ pid, quantity: 1, color })
            dispatch(getCurrentUser())
        }
        else if (flag === '-' && quantity > 1) {
            await apiUpdateCart({ pid, quantity: -1, color });
            dispatch(getCurrentUser())
        } else return
    }

    useEffect(() => {
        if (location.pathname === '/member/my-cart') {
            setMember(true)
        }
    }, [location.pathname])


    return (
        <div className='relative w-full px-4'>
            {!member && <div className='h-[80px] flex items-center justify-center bg-gray-100'>
                <div className='flex flex-col gap-1 w-main'>
                    <h3 className='font-semibold uppercase'>Giỏ hàng</h3>
                    <BreadCrumb category={'Giỏ hàng'} />
                </div>
            </div>}
            {member && <header className='py-4 text-2xl font-semibold text-gray-800 border-b-2 border-gray-500'>
                Giỏ hàng
            </header>}
            <div className={clsx('mx-auto my-8 border w-main', member ? 'border-gray-800' : 'border-gray-300')}>
                <div className={clsx('flex py-3 mx-auto font-bold border-b w-main', member ? 'border-gray-800' : 'border-gray-300')}>
                    <span className='pl-8 flex-6'></span>
                    <span className='flex-1 text-center'>Số lượng</span>
                    <span className='text-center flex-3'>Giá</span>
                </div>
                {current?.cart.map((el, idx) => (
                    <div key={idx} className={clsx('flex py-8 mx-auto font-bold border-b w-main', member ? 'border-gray-800' : 'border-gray-300')}>
                        <span
                            onClick={() => navigate(`/${el?.category?.toLowerCase()}/${el?.product?._id}/${el?.product?.title}`)}
                            className='flex items-center pl-8 text-center w-fit flex-3'>
                            <img src={el?.thumb || el?.product?.thumb} alt="thumb" className='object-cover cursor-pointer w-[100px] h-[100px]' />
                            <div className='flex flex-col items-start justify-center gap-1 ml-4 cursor-pointer'>
                                <span className='font-semibold'>{el.product?.title}</span>
                                <span className='text-sm text-gray-500'>{el.color}</span>
                            </div>
                        </span>
                        <span className='flex-3'></span>
                        <span className='flex-1 w-full text-center'>
                            <div className='flex items-center justify-center h-full'>
                                <div className='flex items-center select-none'>
                                    <span
                                        className='p-2 border-r border-black cursor-pointer'
                                        onClick={() => handleQuantity('-', el.product?._id, el.color, el.quantity)}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        -
                                    </span>
                                    <input
                                        className='w-[50px] text-center py-2 outline-none cursor-default'
                                        min={1}
                                        type="text"
                                        value={el.quantity}
                                        onChange={(e) => handleQuantity(e.target.value)}
                                    />
                                    <span
                                        className='p-2 border-l border-black cursor-pointer'
                                        onClick={() => handleQuantity('+', el.product?._id, el.color, el.quantity)}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        +
                                    </span>
                                </div>
                            </div>
                        </span>
                        <span className='flex items-center justify-center w-full text-center flex-3'>
                            <span className='text-lg font-semibold'>{formatMoney(el?.price || el?.product?.price) + ' VNĐ'}</span>
                        </span>
                    </div>
                ))}
                <div className='flex flex-col items-end justify-center gap-2 m-8'>
                    <span className='flex items-center gap-2 text-xl'>
                        <span className='font-semibold'>Tổng tiền:</span>
                        <span className='font-semibold'>{formatMoney(current?.cart.reduce((total, item) => total + (item?.price || item?.product?.price) * item.quantity, 0)) + ' VNĐ'}</span>
                    </span>
                    <span className='text-sm italic text-gray-500'>
                        *Giá trên chưa bao gồm các khoản thuế, phí vận chuyển và giảm giá.
                    </span>
                    <Link target='_blank' to={`/${path.CHECKOUT}`} className='px-4 py-2 my-2 font-semibold text-white rounded-md bg-main'>
                        Thanh toán
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DetailCart