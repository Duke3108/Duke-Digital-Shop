import React, { memo, useState } from 'react'
import { productInfomation } from '../utils/constants'
import Votebar from './Votebar'
import { renderStarFromNumber } from '../utils/helper'
import Button from './Button'
import { showModal } from '../store/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import VoteOption from './VoteOption'
import { apiRating } from '../apis'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'
import Comment from './Comment'

const ProductInfomation = ({ totalRatings, ratings, reRenderProduct, nameProduct, pid }) => {

    const [activedTab, setActivedTab] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn } = useSelector(state => state.user)

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score || !pid) {
            alert('Vui lòng nhập đầy đủ thông tin đánh giá')
            return
        }
        const response = await apiRating({ star: score, comment, pid, updatedAt: Date.now() })
        if (response?.status) {
            Swal.fire({
                text: 'Cảm ơn bạn đã đánh giá sản phẩm',
                icon: 'success',
                title: 'Đánh giá thành công',
                confirmButtonText: 'OK'
            }).then(() => {
                dispatch(showModal({ isOpenModal: false, modalContent: null }))
                reRenderProduct()
            })
        }
    }

    const handleVote = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'Bạn cần đăng nhập để đánh giá sản phẩm',
                icon: 'warning',
                title: 'Đăng nhập để đánh giá',
                confirmButtonText: 'Đăng nhập',
                showCancelButton: true,
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`)
                }
            })
        } else {
            dispatch(showModal({
                isOpenModal: true,
                modalContent: <VoteOption
                    nameProduct={nameProduct}
                    handleSubmitVoteOption={handleSubmitVoteOption} />,
            }))
        }
    }

    return (
        <div>

            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfomation.map((item) => (
                    <span
                        key={item.id}
                        className={`py-2 px-4 cursor-pointer ${activedTab === +item.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActivedTab(item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
            <div className='w-full p-4 border'>
                {productInfomation.some(item => item.id === activedTab)
                    && productInfomation.find(item => item.id === activedTab)?.content
                }
            </div>
            <div className='flex flex-col py-8 w-main'>
                <div className='flex border'>
                    <div className='flex flex-col items-center justify-center flex-4'>
                        <span className='text-3xl font-semibold'>{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                        <span className='text-sm'>{`(${ratings?.length} đánh giá)`}</span>
                    </div>
                    <div className='flex flex-col gap-2 p-4 flex-6'>
                        {Array.from(Array(5).keys()).reverse().map((el, index) => (
                            <Votebar
                                key={index}
                                number={el + 1}
                                ratingTotal={ratings?.length}
                                ratingCount={ratings?.filter(item => item.star === el + 1).length}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-2 p-4 text-sm'>
                    <span>Bạn đánh giá sao sản phẩm này</span>
                    <Button
                        name='Đánh giá ngay'
                        handleOnClick={handleVote}
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    {ratings?.map((item, index) => (
                        <Comment
                            key={index}
                            updatedAt={item.updatedAt}
                            comment={item.comment}
                            star={item.star}
                            name={item.postedBy?.name}
                            image={item.postedBy?.avatar}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(ProductInfomation)
