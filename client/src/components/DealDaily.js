import React, { useState, useEffect, memo } from 'react'
import icons from '../utils/icons'
import { apiGetProducts } from '../apis/product'
import { formatMoney } from '../utils/helper'
import { renderStarFromNumber } from '../utils/helper'
import Countdown from './Countdown'
import moment from 'moment'
import { secondsToHms } from '../utils/helper'

const { BsStarFill, BiMenu } = icons
let idInterval
const DealDaily = () => {
    const [dealDaily, setDealDaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const fetchDealDaily = async () => {
        const response = await apiGetProducts({
            limit: 1,
            page: Math.round(Math.random() * 10),
            totalRatings: { gt: 4.5 }  // hoặc gte nếu bạn muốn >= 4.5
        })
        if (response.success) {
            setDealDaily(response.products[0])

            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`
            const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000
            const number = secondsToHms(seconds)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        } else {
            setHour(0)
            setMinute(59)
            setSecond(59)
        }
    }

    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()
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
        <div className='flex-auto w-full border'>
            <div className='flex items-center justify-between w-full p-4'>
                <span className='flex justify-center flex-1'><BsStarFill size={20} color='#DD1111' /></span>
                <span className='flex-8 font-semibold text-[20px] flex justify-center text-gray-700'>HẰNG NGÀY</span>
                <span className='flex-1'></span>
            </div>
            <div className='flex flex-col items-center w-full gap-2 px-4 pt-4'>
                <img src={dealDaily?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                    alt=''
                    className='object-contain w-full '
                />
                <span className='text-center line-clamp-1'>{dealDaily?.title}</span>
                <span className='flex h-4'>{renderStarFromNumber(dealDaily?.totalRatings, 20)}</span>
                <span>{`${formatMoney(dealDaily?.price).length === 3 ? formatMoney(dealDaily?.price * 10000) : formatMoney(dealDaily?.price)} VNĐ`}</span>
            </div>
            <div className='px-4 mt-8'>
                <div className='flex items-center justify-center gap-2 mb-4'>
                    <Countdown unit={'Hours'} number={hour} />
                    <Countdown unit={'Minutes'} number={minute} />
                    <Countdown unit={'Second'} number={second} />
                </div>
                <button
                    type='button'
                    className='flex items-center justify-center w-full gap-2 py-2 font-medium text-white bg-main hover:bg-gray-800'
                >
                    <BiMenu />
                    <span>Options</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)