import React, { useState } from 'react'
import { formatMoney } from '../utils/helper'
import bluetag from '../assets/trending.png'
import yellowtag from '../assets/new.png'
import { renderStarFromNumber } from '../utils/helper'
import { SelectedOption } from './'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'
import path from '../utils/path'

const { AiFillEye, BiMenu, FaHeart } = icons

const Product = ({ productData, isNew }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className='w-full px-[10px] text-base'>
            <Link
                className='w-full border p-[15px] flex flex-col items-center'
                to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData.title}`}
                onMouseEnter={(e) => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className='relative w-full'>
                    {isShowOption && <div className='absolute left-0 right-0 flex justify-center gap-2 bottom-1 animate-slide-top'>
                        <SelectedOption icon={<AiFillEye />} />
                        <SelectedOption icon={<BiMenu />} />
                        <SelectedOption icon={<FaHeart />} />
                    </div>}
                    {/* <div className='flex justify-center'>
                        <img src={productData?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                            alt=''
                            className='object-contain '
                        />
                    </div> */}
                    <img src={productData?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                        alt=''
                        className='w-full h-[274px] object-contain '
                    />
                    <img src={isNew ? yellowtag : bluetag} alt=''
                        className={`absolute top-[-15px] right-[-15px] w-[100px] h-[35px] object-cover`} />

                </div>
                <div className='flex flex-col gap-1 items-start w-full mt-[15px]'>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </Link>
        </div>
    )
}

export default Product