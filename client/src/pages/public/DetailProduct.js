import React, { useCallback, useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis/product'
import BreadCrumb from '../../components/common/BreadCrumb'
import ReactImageMagnify from 'react-image-magnify';
import Button from '../../components/button/Button'
import Slider from "react-slick"
import { formatMoney, formatPrice } from '../../utils/helper';
import SelectQuantity from '../../components/common/SelectQuantity';
import { extraInfomation } from '../../utils/constants';
import ExtraInfoItem from '../../components/product/ExtraInfoItem';
import ProductInfomation from '../../components/product/ProductInfomation';
import { CustomSlider } from '../../components';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiUpdateCart } from 'apis';
import { toast } from 'react-toastify';
import { getCurrentUser } from 'store/user/asyncAction';
import path from 'utils/path';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const DetailProduct = ({ quickView, data }) => {

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { current } = useSelector((state) => state.user)
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [update, setUpdate] = useState(false)
    const [variant, setVariant] = useState(null)
    const [pid, setPid] = useState(null)
    const [category, setCategory] = useState(null)
    const [added, setAdded] = useState(false)
    const [hoverButton, setHoverButton] = useState(false)
    const [currentProduct, setCurrentProduct] = useState({
        pid: '',
        title: '',
        price: 0,
        thumb: '',
        images: [],
        quantity: 0,
        color: ''
    })

    const handleQuantity = useCallback((newQuantity) => {
        if (newQuantity > 0) setQuantity(newQuantity)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity])

    const fetchProductDetails = async () => {
        const response = await apiGetProduct(pid)
        if (response) {
            setProduct(response.productData)
            setCurrentImage(response?.productData?.thumb)
            setCurrentProduct({
                title: response?.productData?.title,
                price: response?.productData?.price,
                thumb: response?.productData?.thumb,
                images: response?.productData?.images,
                quantity: response?.productData?.quantity,
                color: response?.productData?.color,
            })
        }
    }

    const fetchRelatedProducts = async () => {
        const response = await apiGetProducts({ category: category, sort: '-createdAt' })
        if (response?.success) setRelatedProducts(response.products)
    }

    useEffect(() => {
        if (current) {
            setAdded(current?.cart?.some(item => item.product?._id === pid))
        } else {
            setAdded(false)
        }
    }, [current, pid])

    useEffect(() => {
        if (variant) {
            setCurrentProduct({
                pid: product?.variants?.find(v => v.sku === variant)?._id,
                title: product?.variants?.find(v => v.sku === variant)?.title,
                price: product?.variants?.find(v => v.sku === variant)?.price,
                thumb: product?.variants?.find(v => v.sku === variant)?.thumb,
                images: product?.variants?.find(v => v.sku === variant)?.images,
                quantity: product?.variants?.find(v => v.sku === variant)?.quantity,
                color: product?.variants?.find(v => v.sku === variant)?.color
            })
            setCurrentImage(product?.variants?.find(v => v.sku === variant)?.thumb)
        } else {
            setCurrentProduct({
                pid: product?._id,
                title: product?.title,
                price: product?.price,
                thumb: product?.thumb,
                images: product?.images,
                quantity: product?.quantity,
                color: product?.color
            })
            setCurrentImage(product?.thumb)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant])

    useEffect(() => {
        if (pid) {
            fetchProductDetails()
            fetchRelatedProducts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    useEffect(() => {
        if (pid) {
            fetchProductDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    useEffect(() => {
        if (data) {
            setPid(data.pid)
            setCategory(data.category)
        } else if (params?.pid) {
            setPid(params.pid)
            setCategory(params.category)
        }
    }, [data, params])

    const reRenderProduct = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const handleAddToCart = async () => {
        if (!current) {
            Swal.fire({
                title: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
                icon: 'info',
                confirmButtonText: 'Đăng nhập',
                showCancelButton: true,
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
            return
        }
        const response = await apiUpdateCart({
            pid: pid,
            color: currentProduct.color,
            quantity,
            thumb: currentProduct.thumb,
            price: currentProduct.price
        })
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


    return (
        <div className='w-full'>
            {!quickView && <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='flex flex-col gap-2 w-main'>
                    <h3 className='font-semibold'>{currentProduct.title ? currentProduct.title : product?.title}</h3>
                    <BreadCrumb title={currentProduct.title ? currentProduct.title : product?.title} category={category} />
                </div>
            </div>}

            <div onClick={e => e.stopPropagation()} className={clsx('flex m-auto mt-4 bg-white w-main', quickView && 'max-w-[900px] max-h-[80vh] gap-16 p-8')}>
                <div className={clsx('flex flex-col gap-4', quickView ? 'w-1/2' : 'w-2/5')}>
                    <div className='h-[458px] w-[458px] object-contain border'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: currentImage,
                                width: 458,
                                height: 458
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />

                    </div>
                    <div className='w-[458px]'>
                        <Slider className='flex items-center justify-center image-slider' {...settings}>
                            {currentProduct.images?.length === 0 && product?.images?.map((image, index) => (
                                <div className='flex-1 w-full cursor-pointer' key={index}>
                                    <img onClick={(e) => { e.stopPropagation(); setCurrentImage(image) }} src={image} alt="sub-product" className='h-[143px] w-[143px] border object-contain' />
                                </div>
                            ))}
                            {currentProduct.images?.length > 0 && currentProduct.images.map((image, index) => (
                                <div className='flex-1 w-full cursor-pointer' key={index}>
                                    <img onClick={(e) => { e.stopPropagation(); setCurrentImage(image) }} src={image} alt="sub-product" className='h-[143px] w-[143px] border object-contain' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className={clsx('flex flex-col gap-4 px-4', quickView ? 'w-1/2' : 'w-2/5')}>
                    <div className='flex items-center justify-between cursor-default'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(currentProduct.price ? currentProduct.price : product?.price))} VNĐ`}</h2>
                        <span className='text-sm text-main'>{`Kho: ${currentProduct.quantity ? currentProduct.quantity : product?.quantity}`}</span>
                    </div>
                    <ul className='pl-5 text-sm text-gray-500 cursor-default list-square'>
                        {product?.description?.length > 1 && product?.description?.map((item, index) => (
                            <li className='leading-6' key={index}>{item}</li>
                        ))}
                        {product?.description?.length === 1 && <div
                            className='mb-8 text-sm line-clamp-6'
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
                    </ul>

                    <div className='flex items-center gap-4 my-4'>
                        <span className='font-semibold'>Color:</span>
                        <div className='flex flex-wrap items-center w-full gap-4'>
                            <div
                                onClick={() => { setVariant(null); setCurrentProduct(product); setCurrentImage(product?.thumb) }}
                                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !variant && 'border-main')}
                            >
                                <img src={product?.thumb} alt="thumb" className='object-cover w-8 h-8 rounded-md' />
                                <span>{product?.color}</span>
                            </div>
                            {product?.variants?.map(item => (
                                <div
                                    key={item.sku}
                                    onClick={() => setVariant(item.sku)}
                                    className={clsx('flex items-center gap-2 p-2 border cursor-pointer', variant === item.sku && 'border-main')}
                                >
                                    <img src={item?.thumb} alt="variant" className='object-cover w-8 h-8 rounded-md' />
                                    <span>{item?.color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Số lượng: </span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                            />
                        </div>

                        <Button
                            handleOnClick={handleAddToCart}
                            name={
                                hoverButton
                                    ? 'Thêm vào giỏ hàng'
                                    : added
                                        ? 'Sản phẩm này đã được thêm vào giỏ hàng'
                                        : 'Thêm vào giỏ hàng'
                            }
                            fw
                            onMouseEnter={() => setHoverButton(true)}
                            onMouseLeave={() => setHoverButton(false)}
                        />
                    </div>
                </div>

                {!quickView && <div className='w-1/5 gap-4 pl-4'>
                    {extraInfomation.map((item) => (
                        <ExtraInfoItem icon={item.icon} title={item.title} sub={item.sub} key={item.id} />
                    ))}
                </div>}
            </div>

            {!quickView && <div className='m-auto mt-8 mb-4 w-main'>
                <ProductInfomation
                    pid={product?._id}
                    nameProduct={product?.title}
                    totalRatings={product?.totalRatings}
                    ratings={product?.rating}
                    reRenderProduct={reRenderProduct}
                />
            </div>}

            {!quickView && <div className='m-auto w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
                    SẢN PHẨM KHÁC </h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider normal product={relatedProducts} />
                </div>

            </div>}

            {!quickView && <div className='w-full h-[100px]'></div>}
        </div>
    )
}

export default DetailProduct