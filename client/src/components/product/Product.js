import React, { memo, useState } from 'react'
import { formatMoney } from '../../utils/helper'
import bluetag from '../../assets/trending.png'
import yellowtag from '../../assets/new.png'
import { renderStarFromNumber } from '../../utils/helper'
import { SelectedOption } from '..'
import icons from '../../utils/icons'
import withBase from 'hocs/withBase'

const { AiFillEye, AiOutlineMenu, FaHeart } = icons

const Product = ({ productData, isNew, normal, navigate }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    const handleNavigate = (e, flag) => {
        e.stopPropagation()
        if (flag === 'MENU') {
            navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData.title}`)
        }
        if (flag === 'VIEW') {
            console.log('View product details')
        }
        if (flag === 'FAVORITE') {
            console.log('Add to favorite')
        }
    }
    return (
        <div className='w-full px-[10px] text-base'>
            <div
                className='w-full border p-[15px] flex flex-col items-center'
                onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData.title}`)}
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
                        <span onClick={(e) => handleNavigate(e, 'VIEW')}><SelectedOption icon={<AiFillEye />} /></span>
                        <span onClick={(e) => handleNavigate(e, 'MENU')}><SelectedOption icon={<AiOutlineMenu />} /></span>
                        <span onClick={(e) => handleNavigate(e, 'FAVORITE')}><SelectedOption icon={<FaHeart />} /></span>
                    </div>}
                    <img src={productData?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                        alt=''
                        className='w-full h-[274px] object-contain '
                    />
                    {!normal && <img src={isNew ? yellowtag : bluetag} alt=''
                        className={`absolute top-[-15px] right-[-15px] w-[100px] h-[35px] object-cover`} />
                    }
                </div>
                <div className='flex flex-col gap-1 items-start w-full mt-[15px]'>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price).length === 3 ? formatMoney(productData?.price * 10000) : formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(Product))