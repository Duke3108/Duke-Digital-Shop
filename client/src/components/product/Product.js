import React, { memo, useState } from 'react'
import { formatMoney } from '../../utils/helper'
import bluetag from '../../assets/trending.png'
import yellowtag from '../../assets/new.png'
import { renderStarFromNumber } from '../../utils/helper'
import { SelectedOption } from '..'
import icons from '../../utils/icons'
import { showModal } from 'store/appSlice'
import { DetailProduct } from 'pages/public'
import { useDispatch, useSelector } from 'react-redux'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { apiDeleteCartItem, apiUpdateCart, apiUpdateWishlist } from 'apis'
import { toast } from 'react-toastify'
import { getCurrentUser } from 'store/user/asyncAction'
import Swal from 'sweetalert2'
import path from 'utils/path'
import clsx from 'clsx'

const { AiFillEye, BsCartPlusFill, BsFillCartCheckFill, FaHeart } = icons

const Product = ({ productData, isNew, normal, wishlist }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    const { current } = useSelector((state) => state.user)
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleNavigate = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'CART') {
            if (!current) {
                Swal.fire({
                    title: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
                    icon: 'info',
                    confirmButtonText: 'Đăng nhập',
                    showCancelButton: true,
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (result.isConfirmed) {
                            navigate({
                                pathname: `/${path.LOGIN}`,
                                search: createSearchParams({ redirect: location.pathname }).toString()
                            })
                        }
                    }
                })
                return
            }
            const response = await apiUpdateCart({ pid: productData?._id, color: productData?.color, quantity: 1 })
            if (response.success) {
                toast.success('Đã thêm sản phẩm vào giỏ hàng', {
                    autoClose: 2000
                })
                dispatch(getCurrentUser())
            } else {
                toast.error('Không thể thêm sản phẩm vào giỏ hàng', {
                    autoClose: 2000
                })
            }
        }
        if (flag === 'REMOVE_CART') {
            const response = await apiDeleteCartItem({ pid: productData?._id })
            if (response.success) {
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
                    autoClose: 3000
                })
                dispatch(getCurrentUser())
            } else {
                toast.error('Không thể xóa sản phẩm khỏi giỏ hàng', {
                    autoClose: 3000
                })
            }
        }
        if (flag === 'VIEW') {
            dispatch(showModal({
                isOpenModal: true,
                modalContent: <DetailProduct
                    quickView
                    data={{ pid: productData?._id, category: productData?.category }}
                />
            }))
        }
        if (flag === 'FAVORITE') {
            const response = await apiUpdateWishlist(productData?._id)
            if (response.success) {
                toast.success('Đã thêm sản phẩm vào danh sách yêu thích', {
                    autoClose: 2000
                })
                dispatch(getCurrentUser())
            } else {
                toast.error('Không thể thực hiện hành động này', {
                    autoClose: 2000
                })
            }
        }
        if (flag === 'REMOVE_FAVORITE') {
            const response = await apiUpdateWishlist(productData?._id)
            if (response.success) {
                toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích', {
                    autoClose: 2000
                })
                dispatch(getCurrentUser())
            } else {
                toast.error('Không thể thực hiện hành động này', {
                    autoClose: 2000
                })
            }
        }
    }

    return (
        <div className='w-full px-[10px] text-base'>
            <div
                className={clsx('w-full p-[15px] flex flex-col items-center cursor-pointer', !wishlist && 'border border-gray-300 rounded-lg')}
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
                        <span title='Xem nhanh' onClick={(e) => handleNavigate(e, 'VIEW')}><SelectedOption icon={<AiFillEye size={20} />} /></span>
                        {current?.cart?.some(el => el?.product?._id === productData?._id)
                            ? <span title='Xóa khỏi giỏ hàng' onClick={(e) => handleNavigate(e, 'REMOVE_CART')}><SelectedOption check icon={<BsFillCartCheckFill color='green' size={20} />} /></span>
                            : <span title='Thêm vào giỏ hàng' onClick={(e) => handleNavigate(e, 'CART')}><SelectedOption icon={<BsCartPlusFill size={20} />} /></span>
                        }
                        {current?.wishlist?.some(el => el?._id === productData?._id)
                            ? <span title='Xóa khỏi danh sách yêu thích' onClick={(e) => handleNavigate(e, 'REMOVE_FAVORITE')}><SelectedOption icon={<FaHeart size={20} color='red' />} /></span>
                            : <span title='Thêm vào danh sách yêu thích' onClick={(e) => handleNavigate(e, 'FAVORITE')}><SelectedOption icon={<FaHeart size={20} />} /></span>
                        }

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

export default memo(Product)