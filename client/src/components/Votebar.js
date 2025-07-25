import React, { memo, useEffect, useRef } from 'react'
import { BsStarFill } from "react-icons/bs";


const Votebar = ({ number, ratingCount, ratingTotal }) => {

    const percentbar = useRef()

    useEffect(() => {
        if (ratingCount && ratingTotal) {
            const percent = (ratingCount / ratingTotal) * 100
            percentbar.current.style.width = `${percent}%`
        } else {
            percentbar.current.style.width = '0%'
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ratingTotal, ratingCount])
    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <div className='flex items-center justify-center flex-1 gap-1 text-sm'>
                <span>{number}</span>
                <BsStarFill color='orange' />
            </div>
            <div className='flex-7'>
                <div className='relative w-full h-2 bg-gray-200 rounded-full '>
                    <div ref={percentbar} className='absolute inset-0 bg-red-500 rounded-full right-2'></div>
                </div>
            </div>
            <div className='justify-end text-xs flex-2'>
                {`${ratingCount || 0} đánh giá`}
            </div>
        </div>
    )
}

export default memo(Votebar)
