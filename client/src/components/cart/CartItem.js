import { apiDeleteCartItem, apiUpdateCart } from 'apis'
import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from 'store/user/asyncAction'
import { formatMoney } from 'utils/helper'
import { FaTrashAlt } from "react-icons/fa";

const CartItem = ({ pid, title, price, thumb, color, quantity }) => {

    const dispatch = useDispatch()

    const handleIncreaseQuantity = async () => {
        await apiUpdateCart({ pid, quantity: 1, color })
        dispatch(getCurrentUser())
    }

    const handleDecreaseQuantity = async () => {
        if (quantity <= 1) {
            await apiDeleteCartItem({ pid, color });
        } else {
            await apiUpdateCart({ pid, quantity: -1, color });
        }
        dispatch(getCurrentUser());
    }

    const handleDeleteItem = async () => {
        await apiDeleteCartItem({ pid, color });
        dispatch(getCurrentUser());
    }

    return (
        <div className='flex justify-between py-4 text-white border-b border-gray-700'>
            <div className='flex items-center'>
                <img src={thumb} alt={title} className='object-cover w-16 h-16 mr-4 rounded' />
                <div className='flex flex-col'>
                    <span className='font-semibold'>{title}</span>
                    <span className='text-sm text-gray-400'>{color}</span>
                    <div className='mt-2 border border-gray-500 rounded w-fit'>
                        <button onClick={() => handleDecreaseQuantity()} className='px-2 hover:bg-gray-600'>-</button>
                        <span className='px-3 py-1 border-l border-r border-gray-500'>{quantity}</span>
                        <button onClick={() => handleIncreaseQuantity()} className='px-2 hover:bg-gray-600'>+</button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-end justify-between'>


                <span className='cursor-pointer' onClick={handleDeleteItem}><FaTrashAlt /></span>

                <span className='text-sm font-semibold'>
                    {`${formatMoney(price * quantity)} VNĐ`}
                </span>

            </div>
        </div>
    )
}

export default memo(CartItem)
