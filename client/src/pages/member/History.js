import { apiGetUserOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'components'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { orderStatus } from 'utils/constants'
import { formatMoney } from 'utils/helper'

const History = () => {
    const [orders, setOrders] = useState(null)
    const [count, setCount] = useState(0)
    const [params] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const {
        register,
        formState: { errors },
        watch,
    } = useForm()

    const status = watch('status')
    //const q = watch('q')

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }

    const fetchOrders = async (params) => {
        const response = await apiGetUserOrders({ ...params, limit: 10, sort: '-createdAt' })
        if (response.success) {
            setOrders(response.orders)
            setCount(response.counts)
        }
    }

    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchOrders(pr)
    }, [params])

    return (
        <div className='relative w-full px-4 py-2'>
            <header className='py-4 text-2xl font-semibold text-gray-800 border-b-2 border-gray-500'>
                Lịch sử mua hàng
            </header>
            <div className='w-full p-4'>

                <form className='w-[45%] flex items-center gap-4 py-2'>
                    <div className='flex-1'>
                        <InputForm
                            id={'q'}
                            register={register}
                            errors={errors}
                            fw
                            placeholder={'Tìm kiếm lịch sử mua hàng...'}
                        />
                    </div>
                    <div className='flex-1'>
                        <CustomSelect
                            options={orderStatus}
                            value={status}
                            onChange={(val) => handleSearchStatus(val)}
                            wrapClassname='w-full'
                        />
                    </div>
                </form>
                <table className='w-full my-2 table-auto cursor-default'>
                    <thead className='font-bold text-center text-white bg-gray-700'>
                        <tr className='border border-gray-500'>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Sản phẩm</th>
                            <th className='px-4 py-2'>Địa chỉ</th>
                            <th className='px-4 py-2'>Tổng tiền</th>
                            <th className='px-4 py-2'>Trạng thái</th>
                            <th className='px-4 py-2'>Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {orders && orders.length > 0 ? orders.map((order, index) => (
                            <tr key={order._id} className='border border-gray-500'>
                                <td className='px-4 py-2'>{orders.length - ((+params.get('page') ? +params.get('page') - 1 : 0) * 10) - index}</td>
                                <td className='flex flex-col items-center gap-2 px-4 py-2'>
                                    <div className='flex flex-col items-start'>
                                        {order.products.map((item, idx) => (
                                            <div className='flex items-center gap-3' key={idx}>
                                                <img src={item.thumb} alt="" className='object-cover w-10 h-10 rounded-md' />
                                                <span className='flex flex-col items-start'>
                                                    <span className='font-semibold'>{item.title}</span>
                                                    <span className='text-sm text-gray-500'>{item.color ? `${item.color}` : ''}</span>
                                                </span>
                                                <span className='text-sm '>x {item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                </td>
                                <td className='px-4 py-2'>{order.address}</td>
                                <td className='px-4 py-2'>{formatMoney(order.total * 26220)}đ</td>
                                <td className='px-4 py-2'>{order.status === 'Succeed' ? 'Đã thanh toán' : 'Chờ thanh toán'}</td>
                                <td className='px-4 py-2'>{moment(order.createdAt).format('DD/MM/YYYY')}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className='py-4'>Không có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='flex mt-4'>
                    <Pagination
                        totalCount={count}
                    />
                </div>
            </div>
        </div>
    )
}

export default History