import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis/product'
import BreadCrumb from '../../components/BreadCrumb'
import ReactImageMagnify from 'react-image-magnify';
import Button from '../../components/Button'
import Slider from "react-slick"
import { formatMoney, formatPrice, renderStarFromNumber } from '../../utils/helper';
import SelectQuantity from '../../components/SelectQuantity';
import { extraInfomation } from '../../utils/constants';
import ExtraInfoItem from '../../components/ExtraInfoItem';
import ProductInfomation from '../../components/ProductInfomation';
import { CustomSlider } from '../../components';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const DetailProduct = () => {

    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [update, setUpdate] = useState(false)

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
                    <h3 className='font-semibold'>{title}</h3>
                    <BreadCrumb title={title} category={category} />
                </div>
            </div>

            <div className='flex m-auto mt-4 w-main'>
                <div className='flex flex-col w-2/5 gap-4'>
                    <div className='h-[458px] w-[458px] border'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: currentImage
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />

                    </div>
                    <div className='w-[458px] '>
                        <Slider className='flex items-center justify-between image-slider' {...settings}>
                            {product?.images?.map((image, index) => (
                                <div className='flex-1 cursor-pointer' key={index}>
                                    <img onClick={(e) => { e.stopPropagation(); setCurrentImage(image) }} src={image} alt="sub-product" className='h-[143px] w-auto border object-cover' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='flex flex-col w-2/5 gap-4 px-4'>
                    <div className='flex items-center justify-between cursor-default'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))} VNĐ`}</h2>
                        <span className='text-sm text-main'>{`Kho: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex items-center gap-2 cursor-default'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                        <span className='text-sm italic text-main'>{`(Đã bán: ${product?.sold} cái)`}</span>
                    </div>
                    <ul className='pl-5 text-sm text-gray-500 cursor-default list-square'>
                        {product?.description?.map((item, index) => (
                            <li className='leading-6' key={index}>{item}</li>
                        ))}
                    </ul>
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
                <div className='w-1/5 gap-4'>
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

            <div className='m-auto mt-8 mb-4 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
                    SẢN PHẨM KHÁC </h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider normal product={relatedProducts} />
                </div>

            </div>
        </div>
    )
}

export default DetailProduct