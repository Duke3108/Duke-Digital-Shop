/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import paypalLogo from '../../assets/paypal.png'
import { formatMoney } from 'utils/helper'
import { InputForm, PaymentSuccess, Paypal } from 'components'
import { useForm } from 'react-hook-form'
import { getCurrentUser } from 'store/user/asyncAction'

const Checkout = () => {
    const { current } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const { register, formState: { errors }, watch, setValue } = useForm()
    const [isSuccess, setIsSuccess] = useState(false)
    const address = watch('address')

    useEffect(() => {
        setValue('address', current?.address)
    }, [current.address])

    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrentUser())
        }
    }, [isSuccess])

    return (
        <div className='flex w-full h-full max-h-screen gap-6 p-8 overflow-y-auto'>
            {isSuccess && <PaymentSuccess />}
            <div className='flex items-center justify-center w-full flex-4'>
                <img src={paypalLogo} alt="payment" className='h-[70%] object-contain' />
            </div>
            <div className='flex flex-col items-center justify-center w-full gap-4 flex-6'>
                <h2 className='mb-4 text-3xl font-bold'>Thanh toán đơn hàng của bạn</h2>
                <table className='w-full table-auto'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='p-4 text-center border-b-2 border-gray-300'>Sản phẩm</th>
                            <th className='p-4 text-center border-b-2 border-gray-300'>Màu</th>
                            <th className='p-4 text-center border-b-2 border-gray-300'>Giá</th>
                            <th className='p-4 text-center border-b-2 border-gray-300'>Số lượng</th>
                            <th className='p-4 text-center border-b-2 border-gray-300'>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current?.cart.map((item, index) => (
                            <tr key={index} className='cursor-default hover:bg-gray-100'>
                                <td className='p-4 text-center border-b border-gray-300'>{item.product.title}</td>
                                <td className='p-4 text-center border-b border-gray-300'>{item.color}</td>
                                <td className='p-4 text-center border-b border-gray-300'>{formatMoney(item.price || item.product.price)}</td>
                                <td className='p-4 text-center border-b border-gray-300'>{item.quantity}</td>
                                <td className='p-4 text-center border-b border-gray-300'>{formatMoney((item.price || item.product.price) * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='w-full max-w-[750px] mt-6 gap-2 flex flex-col'>
                    <span className='flex gap-4 text-md'>
                        <span className='font-semibold'>Tổng tiền:</span>
                        <span className='font-semibold text-main'>{formatMoney(current?.cart.reduce((total, item) => total + (item?.price || item?.product?.price) * item.quantity, 0)) + ' VNĐ'}</span>
                    </span>
                    <InputForm
                        label={'Địa chỉ giao hàng'}
                        placeholder={'Vui lòng nhập địa chỉ giao hàng'}
                        register={register}
                        errors={errors}
                        id={'address'}
                    />
                </div>
                {address && address?.length > 10 && <div className='w-full mt-8'>
                    <Paypal
                        amount={Math.round(current?.cart.reduce((total, item) => total + (item?.price || item?.product?.price) * item.quantity, 0) / 26220)}
                        payload={{
                            products: current?.cart.map(item => ({
                                product: item.product._id,
                                title: item.product.title,
                                quantity: item.quantity,
                                color: item.color,
                                price: item.price || item.product.price,
                                thumb: item.thumb || item.product.thumb
                            })),
                            total: Math.round(current?.cart.reduce((total, item) => total + (item?.price || item?.product?.price) * item.quantity, 0) / 26220),
                            address,
                            orderBy: current?._id
                        }}
                        setIsSuccess={setIsSuccess}
                    />
                </div>}
            </div>
        </div>
    )
}

export default Checkout