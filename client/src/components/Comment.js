import React, { memo } from 'react'
import avt from '../assets/user.png'
import moment from 'moment'
import { renderStarFromNumber } from '../utils/helper'

const Comment = ({ image = avt, name = 'Anonymous', updatedAt, comment, star }) => {
    return (
        <div className='flex gap-4'>
            <div className='flex-none'>
                <img src={image} alt="avatar" className='w-[30px] h-[30px] rounded-full object-cover' />
            </div>
            <div className='flex flex-col flex-auto text-sm'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-semibold'>{name}</h3>
                    <span className='text-xs italic'>{moment(updatedAt).fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 py-2 pl-4 mt-4 text-sm bg-gray-100 border border-gray-300'>
                    <span className='flex items-center gap-1'>
                        <span className='font-semibold'>Vote:</span>
                        <span className='flex items-center gap-1'>
                            {renderStarFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    <span className='flex gap-1'>
                        <span className='font-semibold'>Comment:</span>
                        <span className='flex items-center gap-1'>{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment)
