import { Sidebar, Banner, BestSeller, DealDaily, FeatureProducts, CustomSlider } from '../../components'
import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import icons from '../../utils/icons'
import { apiGetProducts } from '../../apis/product'

const { IoIosArrowForward } = icons

const Home = () => {
    const [newProducts, setNewProduct] = useState(null)
    const { categories } = useSelector(state => state.app)
    //const { isLoggedIn, current } = useSelector(state => state.user)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-createdAt' })
        if (response?.success) setNewProduct(response.products)
    }

    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <>
            <div className='flex mt-6 w-main'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto '>
                    <Banner />
                    <BestSeller />
                </div>

            </div>
            <div className='my-8 w-main'>
                <FeatureProducts />
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
                    HÀNG MỚI VỀ</h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider
                        product={newProducts}
                    />
                </div>
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>HÀNG HOT</h3>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {categories?.filter(el => el.brand.length > 0)?.slice(0, 6)?.map((el, index) => (
                        <div
                            key={index}
                            className='w-[396px]'
                        >
                            <div className='border flex p-4 gap-4 min-h-[190px]'>
                                <img src={el?.image} alt='' className='w-[144px] flex-1 h-[129px] object-cover' />
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase'>{el.title}</h4>
                                    <ul className='text-sm'>
                                        {el?.brand?.slice(0, 6).map((item, index) => (
                                            <span key={index} className='flex items-center gap-1 text-gray-500'>
                                                <IoIosArrowForward size={14} />
                                                <li>{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>BLOG POST</h3>
            </div>
        </>
    )
}

export default memo(Home)