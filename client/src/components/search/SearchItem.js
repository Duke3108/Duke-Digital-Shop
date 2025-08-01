import React, { memo, useEffect, useState } from 'react'
import icons from '../../utils/icons'
import { colors } from '../../utils/constants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../../apis'
import useDebounce from '../../hooks/useDebounce'

const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {

    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { category } = useParams()
    const [selected, setSelected] = useState([])
    const [price, setPrice] = useState({
        from: '',
        to: ''
    })

    const [maxPrice, setMaxPrice] = useState(null)
    const handleSelect = (e) => {
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFilter(null)
    }

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 })
        if (response.success) setMaxPrice(response.products[0].price)
    }

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = i[1]
        if (selected.length > 0) {
            queries.color = selected.join(',')
            queries.page = 1
        } else {
            delete queries.color
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        }, { replace: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    useEffect(() => {
        if (type === 'input') fetchBestPriceProduct()
    }, [type])

    useEffect(() => {
        if (price.from && price.to && price.from > price.to) {
            alert('Giá từ không được lớn hơn giá đến')
        }
    }, [price])

    const debouncePriceFrom = useDebounce(price.from, 1000)
    const debouncePriceTo = useDebounce(price.to, 1000)
    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = i[1]
        if (Number(price.from) > 0) queries.from = price.from
        else delete queries.from
        if (Number(price.to) > 0) queries.to = price.to
        else delete queries.to
        queries.page = 1
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        }, { replace: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncePriceFrom, debouncePriceTo])

    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className='relative z-10 flex items-center justify-between gap-6 p-3 text-xs text-gray-500 border border-gray-800 cursor-pointer'>
            <span className='capitalize'>{name ? name : 'Màu'}</span>
            <AiOutlineDown />
            {activeClick === name && <div className='absolute left-0 p-4 bg-white border min-w-[150px] top-[calc(100%+1px)] w-fit'>
                {type === 'checkbox' && <div onClick={(e) => { e.stopPropagation() }}>
                    <div className='flex items-center justify-between gap-8 p-4 border-b'>
                        <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                        <span
                            className='underline cursor-pointer hover:text-main'
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelected([])
                                changeActiveFilter(null)
                            }}
                        >
                            Reset
                        </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className='flex flex-col gap-2 mt-4'>
                        {colors.map((el, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <input
                                    type='checkbox'
                                    value={el}
                                    onChange={handleSelect}
                                    id={el}
                                    checked={selected.some(selectedItem => selectedItem === el)}
                                    className='form-checkbox'
                                />
                                <label className='text-gray-700 capitalize' htmlFor={el}>{el}</label>
                            </div>
                        ))}
                    </div>

                </div>}
                {type === 'input' && <div onClick={(e) => e.stopPropagation()}>
                    <div className='flex items-center justify-between gap-8 p-4 border-b'>
                        <span className='whitespace-nowrap'>{`Giá cao nhất là ${Number(maxPrice).toLocaleString()} VNĐ`}</span>
                        <span onClick={() => {
                            setPrice({ from: '', to: '' })
                            changeActiveFilter(null)
                        }} className='underline cursor-pointer hover:text-main'>
                            Reset
                        </span>
                    </div>
                    <div className='flex items-center gap-2 p-2' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center gap-2'>
                            <label htmlFor="from">Từ</label>
                            <input
                                onChange={(e) => setPrice(prev => ({ ...prev, from: e.target.value }))}
                                value={price.from}
                                className='form-input'
                                type="number"
                                id='from' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor="to">Đến</label>
                            <input
                                onChange={(e) => setPrice(prev => ({ ...prev, to: e.target.value }))}
                                value={price.to}
                                className='form-input'
                                type="number"
                                id='to' />
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

export default memo(SearchItem)
