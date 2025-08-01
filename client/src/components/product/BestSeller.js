import React, { useEffect, useState, memo } from 'react'
import { apiGetProducts } from '../../apis/product'
import CustomSlider from '../common/CustomSlider'

const tabs = [
    { id: 1, name: 'bán chạy' },
    { id: 2, name: 'hàng mới' },
]
const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [newProduct, setNewProduct] = useState(null)
    const [activeTab, setActiveTab] = useState(1)
    const [products, setProducts] = useState(null)

    const fetchProducts = async () => {
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })])
        if (response[0]?.success) {
            setBestSellers(response[0].products)
            setProducts(response[0].products)
        }
        if (response[1]?.success) setNewProduct(response[1].products)
        setProducts(response[1].products)
    }

    useEffect(() => {
        fetchProducts()

    }, [])

    useEffect(() => {
        if (activeTab === 1) setProducts(bestSellers)
        if (activeTab === 2) setProducts(newProduct)
    }, [activeTab, bestSellers, newProduct])
    return (
        <div>

            <div className='flex text-[20px] ml-[-32px] pb-4'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold px-8 uppercase border-r cursor-pointer ${activeTab === el.id ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab(el.id)}
                    >{el.name}</span>

                ))}
            </div>
            <div className='border-t-2 border-main'>
                <div className='mt-5 mx-[-10px]'>
                    <CustomSlider
                        activeTab={activeTab}
                        product={products}
                    />
                </div>
            </div>
            <div className='flex w-full gap-4 mt-8'>
                <img
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/promo-23_2000x_crop_center.png?v=1750842393'
                    alt=''
                    className='flex-1 object-contain'
                />
                <img
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/promo-24_2000x_crop_center.png?v=1750842410'
                    alt=''
                    className='flex-1 object-contain'
                />
            </div>
        </div>
    )
}

export default memo(BestSeller)