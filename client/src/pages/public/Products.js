import React, { useCallback, useEffect, useState } from 'react'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BreadCrumb, InputSelect, Pagination, Product, SearchItem } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'
import { sortOptions } from '../../utils/constants'


const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

const Products = () => {

    const navigate = useNavigate()
    const { category } = useParams()
    const [products, setProducts] = useState(null)
    const [activeClick, setActiveClick] = useState(null)
    const [sort, setSort] = useState('')
    const [nameColor, setNameColor] = useState('')
    const [params] = useSearchParams()

    const fetchProductsByCategory = async (queries) => {
        if (category) {
            const updatedQueries = { ...queries, limit: 12, category }
            const response = await apiGetProducts(updatedQueries)
            if (response.success) setProducts(response)
        } else {
            const response = await apiGetProducts({ limit: 12, ...queries })
            if (response.success) setProducts(response)
        }
    }

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])

    const changeValue = useCallback((value) => {
        setSort(value)
    }, [])

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        let priceQuery = {}
        setNameColor(queries.color)
        if (queries.to && queries.from) {
            priceQuery = {
                '$and': [
                    { price: { gte: Number(queries.from) } },
                    { price: { lte: Number(queries.to) } }
                ]
            }
            delete queries.price
        } else {
            if (queries.from) queries.price = { gte: Number(queries.from) }
            if (queries.to) queries.price = { lte: Number(queries.to) }
        }
        delete queries.from
        delete queries.to
        const q = { ...priceQuery, ...queries }
        fetchProductsByCategory(q)
        window.scrollTo(0, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    useEffect(() => {
        if (sort) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ sort }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort])

    useEffect(() => {
        if (!category) {
            navigate(`/products/all`, { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category])

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='flex flex-col gap-2 w-main'>
                    <h3 className='font-semibold uppercase'>{category}</h3>
                    <BreadCrumb category={category} />
                </div>
            </div>
            <div className='flex justify-between p-4 m-auto mt-8 border w-main'>
                <div className='flex flex-col flex-auto w-4/5 gap-2'>
                    <span className='text-sm font-semibold'>Bộ lọc</span>
                    <div className='flex items-center gap-4'>
                        <SearchItem
                            name='Giá'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter} y
                            type='input'
                        />
                        <SearchItem
                            name={nameColor}
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                        />
                    </div>
                </div>
                <div className='flex flex-col w-1/5 gap-3'>
                    <span className='text-sm font-semibold'>Sắp Xếp</span>
                    <div className='w-full'>
                        <InputSelect
                            value={sort}
                            changeValue={changeValue}
                            options={sortOptions}
                        />
                    </div>
                </div>
            </div>

            <div className='m-auto mt-8 w-main'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column">
                    {products?.products?.map((el, index) => (
                        <Product
                            key={index}
                            productData={el}
                            normal={true}
                        />
                    ))}
                </Masonry>
            </div>

            <div className='flex justify-end m-auto my-4 w-main'>
                <Pagination totalCount={products?.counts} />
            </div>
            <div className='w-full h-[100px]'></div>
        </div>
    )
}

export default Products