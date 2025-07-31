import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const DetailProduct = () => {

    const { pid, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [update, setUpdate] = useState(false)
    const [variant, setVariant] = useState(null)
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        price: 0,
        thumb: '',
        images: [],
        quantity: 0
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
        } else {
            console.error('Failed to fetch product details')
        }
    }

    const fetchRelatedProducts = async () => {
        const response = await apiGetProducts({ category: category, sort: '-createdAt' })
        if (response?.success) setRelatedProducts(response.products)
    }

    useEffect(() => {
        if (variant) {
            setCurrentProduct({
                title: product?.variants?.find(v => v.sku === variant)?.title,
                price: product?.variants?.find(v => v.sku === variant)?.price,
                thumb: product?.variants?.find(v => v.sku === variant)?.thumb,
                images: product?.variants?.find(v => v.sku === variant)?.images,
                quantity: product?.variants?.find(v => v.sku === variant)?.quantity,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant])

    useEffect(() => {
        if (pid) {
            fetchProductDetails()
            fetchRelatedProducts()
        }
        window.scrollTo(0, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    useEffect(() => {
        if (pid) {
            fetchProductDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    const reRenderProduct = useCallback(() => {
        setUpdate(!update)
    }, [update])

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='flex flex-col gap-2 w-main'>
                    <h3 className='font-semibold'>{currentProduct.title ? currentProduct.title : product?.title}</h3>
                    <BreadCrumb title={currentProduct.title ? currentProduct.title : product?.title} category={category} />
                </div>
            </div>

            <div className='flex m-auto mt-4 w-main'>
                <div className='flex flex-col w-2/5 gap-4'>
                    <div className='h-[458px] w-[458px] border'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: currentProduct.thumb ? currentProduct.thumb : product?.thumb,
                                width: 458,
                                height: 458
                            },
                            largeImage: {
                                src: currentProduct.thumb ? currentProduct.thumb : product?.thumb,
                                width: 1800,
                                height: 1500
                            }
                        }} />

                    </div>
                    <div className='w-[458px] '>
                        <Slider className='flex items-center justify-between image-slider' {...settings}>
                            {currentProduct.images.length === 0 && product?.images?.map((image, index) => (
                                <div className='flex-1 cursor-pointer' key={index}>
                                    <img onClick={(e) => { e.stopPropagation(); setCurrentImage(image) }} src={image} alt="sub-product" className='h-[143px] w-auto border object-cover' />
                                </div>
                            ))}
                            {currentProduct.images.length > 0 && currentProduct.images.map((image, index) => (
                                <div className='flex-1 cursor-pointer' key={index}>
                                    <img onClick={(e) => { e.stopPropagation(); setCurrentImage(image) }} src={image} alt="sub-product" className='h-[143px] w-auto border object-cover' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className='flex flex-col w-2/5 gap-4 px-4'>
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
                                onClick={() => { setVariant(null); setCurrentProduct(product) }}
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
                            name='Thêm vào giỏ hàng'
                            fw
                        />
                    </div>
                </div>

                <div className='w-1/5 gap-4 pl-4'>
                    {extraInfomation.map((item) => (
                        <ExtraInfoItem icon={item.icon} title={item.title} sub={item.sub} key={item.id} />
                    ))}
                </div>
            </div>

            <div className='m-auto mt-8 mb-4 w-main'>
                <ProductInfomation
                    pid={product?._id}
                    nameProduct={product?.title}
                    totalRatings={product?.totalRatings}
                    ratings={product?.rating}
                    reRenderProduct={reRenderProduct}
                />
            </div>

            <div className='m-auto w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
                    SẢN PHẨM KHÁC </h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider normal product={relatedProducts} />
                </div>

            </div>

            <div className='w-full h-[100px]'></div>
        </div>
    )
}

export default DetailProduct