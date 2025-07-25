import React, { memo, useEffect, useRef, useState } from 'react'
import logo from '../assets/logo_digital.png'
import { voteOptions } from '../utils/constants'
import { AiFillStar } from 'react-icons/ai'
import Button from './Button'

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {

    const modalRef = useRef()
    const [chosenStar, setChosenStar] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [])

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className='bg-white rounded-lg w-[700px] p-4 flex flex-col gap-4 items-center justify-center'
        >
            <img src={logo} alt="logo" className='w-[300px] mt-8 mb-4 object-contain' />
            <h2 className='text-xl font-medium text-center'>{nameProduct}</h2>
            <textarea
                className='w-full h-[200px] text-md form-textarea placeholder:italic placeholder:text-sm placeholder:text-gray-500'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Nhập đánh giá của bạn tại đây...'></textarea>
            <div className='flex flex-col w-full gap-4'>
                <p className='text-center'>Bạn cảm thấy sản phẩm này như thế nào?</p>
                <div className='flex items-center justify-center gap-4'>
                    {voteOptions.map((item) => (
                        <div
                            onClick={() => setChosenStar(item.id)}
                            className='w-[110px] bg-gray-200 hover:bg-gray-300 cursor-pointer p-4 flex items-center h-[110px] flex-col gap-2 justify-center rounded-md'
                            key={item.id}>
                            {Number(chosenStar) && chosenStar >= item.id
                                ? <AiFillStar color='orange' size={18} />
                                : <AiFillStar color='gray' size={18} />}
                            <span className='whitespace-nowrap'>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button fw handleOnClick={() => handleSubmitVoteOption({ comment, score: chosenStar })} name='Gửi đánh giá' />
        </div>
    )
}

export default memo(VoteOption)
