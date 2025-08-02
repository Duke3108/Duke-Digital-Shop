import Button from 'components/button/Button'
import CartItem from 'components/cart/CartItem'
import React, { memo } from 'react'
import { MdClose } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showCart } from 'store/appSlice'
import { formatMoney } from 'utils/helper'
import path from 'utils/path'

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { current } = useSelector(state => state.user)
    const handleToCartDetail = () => {
        if (current?.cart && current?.cart?.length > 0) {
            dispatch(showCart({ isShowCart: false }))
            return navigate(`/${path.DETAIL_CART}`)
        } else return
    }
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] p-6 h-screen overflow-hidden flex flex-col bg-[#1C1D1D] text-white'>
            <header className='flex items-center justify-between flex-1 text-2xl font-bold border-b border-gray-600 cursor-default'>
                <span >Giỏ hàng</span>
                <span onClick={() => dispatch(showCart({ isShowCart: false }))} className='p-2 cursor-pointer'><MdClose size={24} /></span>
            </header>

            <section className='flex-7'>
                {(!current?.cart || current?.cart?.length === 0) && <span className='text-sm font-semibold'>Giỏ hàng của bạn hiện đang trống.</span>}
                {(current?.cart?.length > 0) &&
                    current.cart
                        .map((item, index) => (
                            <CartItem
                                key={index}
                                pid={item?.product?._id}
                                title={item?.product?.title}
                                price={item?.price || item?.product?.price}
                                thumb={item?.thumb || item?.product?.thumb}
                                color={item?.color}
                                quantity={item?.quantity}
                            />
                        ))
                }
            </section>

            <div className='flex flex-col flex-2'>
                <div className='flex items-center justify-between py-4 border-t-2 border-gray-600'>
                    <span>Tổng cộng</span>
                    <span>{formatMoney(current?.cart?.reduce((total, item) => total + Number(item?.product?.price) * item?.quantity, 0)) + ' VNĐ'}</span>
                </div>
                <span className='text-sm italic text-center text-gray-300'>
                    *Giá trên chưa bao gồm các khoản thuế, phí vận chuyển và giảm giá.
                </span>
                <div onClick={handleToCartDetail} className='flex justify-center mt-4'>
                    <Button
                        fw
                        name={'Thanh toán'}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(Cart)