import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity }) => {
    return (
        <div className='flex items-center select-none'>
            <span
                className='p-2 border-r border-black cursor-pointer'
                onClick={() => handleQuantity(quantity - 1)}
                onMouseDown={(e) => e.preventDefault()}
            >
                -
            </span>
            <input
                className='w-[50px] text-center py-2 outline-none cursor-default'
                min={1}
                type="text"
                value={quantity}
                onChange={(e) => handleQuantity(e.target.value)}
            />
            <span
                className='p-2 border-l border-black cursor-pointer'
                onClick={() => handleQuantity(quantity + 1)}
                onMouseDown={(e) => e.preventDefault()}
            >
                +
            </span>
        </div>
    )
}

export default memo(SelectQuantity)
