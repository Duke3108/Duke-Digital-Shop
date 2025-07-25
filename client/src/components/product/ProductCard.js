import React, { memo } from 'react'
import { formatMoney, renderStarFromNumber } from '../../utils/helper'

const ProductCard = ({ price, totalRatings, title, image }) => {
    return (
        <div className='flex-auto w-1/3 px-[10px] mb-[20px]'>
            <div className='flex w-full border'>
                <img src={image} alt='products' className='w-[120px] object-contain p-4' />
                <div className='flex flex-col gap-1 items-start w-full mt-[15px] text-sm'>
                    <span className='text-sm capitalize line-clamp-1'>{title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatMoney(price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(ProductCard)