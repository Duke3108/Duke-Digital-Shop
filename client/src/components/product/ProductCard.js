import React, { memo } from 'react'
import { formatMoney, renderStarFromNumber } from '../../utils/helper'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ category, pid, price, totalRatings, title, image }) => {

    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
            className='flex-auto w-1/3 px-[10px] mb-[20px] cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out'>
            <div className='flex w-full border'>
                <img src={image} alt='products' className='w-[120px] object-contain p-4' />
                <div className='flex flex-col gap-1 items-start w-full mt-[15px] text-sm'>
                    <span className='text-sm capitalize line-clamp-1'>{title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatMoney(price).length < 6 ? formatMoney(price * 1000) : formatMoney(price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(ProductCard)