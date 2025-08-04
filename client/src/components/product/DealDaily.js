/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from 'react'
import icons from '../../utils/icons'
import { apiGetProducts } from '../../apis/product'
import { formatMoney } from '../../utils/helper'
import { renderStarFromNumber } from '../../utils/helper'
import Countdown from '../common/Countdown'
import moment from 'moment'
import { secondsToHms } from '../../utils/helper'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDealDaily } from 'store/product/productSlice'

const { BsStarFill, AiOutlineMenu } = icons
let idInterval
const DealDaily = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const { dealDaily } = useSelector((state) => state.products)

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({
            sort: '-totalRatings',
            limit: 20,
        })
        if (response.success) {
            const nextMidnight = new Date()
            // Đặt giờ thành 0h ngày hôm sau
            nextMidnight.setHours(24, 0, 0, 0)
            const data = response.products[Math.floor(Math.random() * response.products.length)]
            dispatch(getDealDaily({ data, time: nextMidnight.getTime() }))
        }
    }


    useEffect(() => {
        if (dealDaily?.time) {
            const deltaTime = dealDaily?.time - Date.now()
            const number = secondsToHms(deltaTime)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
    }, [dealDaily])

    useEffect(() => {
        idInterval && clearInterval(idInterval)
        if (moment(moment(dealDaily?.time).format('MM/DD/YYYY')).isBefore(moment())) {
            fetchDealDaily()
        }
    }, [expireTime])

    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour, expireTime])

    return (
        <div className='flex-auto w-full transition-all duration-300 ease-in-out border'>
            <div className='flex items-center justify-between w-full p-4'>
                <span className='flex justify-center flex-1'><BsStarFill size={20} color='#DD1111' /></span>
                <span className='flex-8 font-semibold text-[20px] flex justify-center text-gray-700'>HẰNG NGÀY</span>
                <span className='flex-1'></span>
            </div>
            <div className='flex flex-col items-center w-full gap-2 px-4 pt-4'>
                <img
                    onClick={() => navigate(`/${dealDaily?.data?.category?.toLowerCase()}/${dealDaily?.data?._id}/${dealDaily?.data?.title}`)}
                    src={dealDaily?.data?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                    alt=''
                    className='object-contain w-full cursor-pointer'
                />
                <span
                    onClick={() => navigate(`/${dealDaily?.data?.category?.toLowerCase()}/${dealDaily?.data?._id}/${dealDaily?.data?.title}`)}
                    className='text-center cursor-pointer line-clamp-1 hover:text-main'>{dealDaily?.data?.title}</span>
                <span className='flex h-4'>{renderStarFromNumber(dealDaily?.data?.totalRatings, 20)}</span>
                <span>{`${formatMoney(dealDaily?.data?.price).length === 3 ? formatMoney(dealDaily?.data?.price * 10000) : formatMoney(dealDaily?.data?.price)} VNĐ`}</span>
            </div>
            <div className='px-4 mt-8'>
                <div className='flex items-center justify-center gap-2 mb-4'>
                    <Countdown unit={'Hours'} number={hour} />
                    <Countdown unit={'Minutes'} number={minute} />
                    <Countdown unit={'Second'} number={second} />
                </div>
                <button
                    onClick={() => navigate(`/${dealDaily?.data?.category?.toLowerCase()}/${dealDaily?.data?._id}/${dealDaily?.data?.title}`)}
                    type='button'
                    className='flex items-center justify-center w-full gap-2 py-2 font-medium text-white bg-main hover:bg-gray-500'
                >
                    <AiOutlineMenu />
                    <span>Options</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)