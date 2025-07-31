import { apiDeleteProduct, apiGetProducts } from 'apis'
import { CustomizeVariants, InputField, Loading, Pagination } from 'components'
import useDebounce from 'hooks/useDebounce'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/appSlice'
import Swal from 'sweetalert2'
import { formatMoney } from 'utils/helper'
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import UpdateProduct from 'pages/admin/UpdateProduct'
import { BiSolidCustomize } from 'react-icons/bi'

const ManageProduct = () => {

    const [params] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [products, setProducts] = useState(null)
    const [count, setCount] = useState(0)
    const [update, setUpdate] = useState(false)
    const [customizeVariants, setCustomizeVariants] = useState(null)
    const [queries, setQueries] = useState({
        q: ""
    })
    const [editProduct, setEditProduct] = useState(null)

    const fetchProducts = async (params) => {
        dispatch(showModal({
            isOpenModal: true,
            modalContent: <Loading />
        }))
        const response = await apiGetProducts({ ...params })
        dispatch(showModal({
            isOpenModal: false,
            modalContent: null
        }))
        if (response.success) {
            setProducts(response.products)
            setCount(response.counts)
        }
    }

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const queriesQ = useDebounce(queries.q, 1000)
    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        if (queriesQ) {
            searchParams.q = queriesQ
            searchParams.page = 1
            navigate({
                pathname: '/admin/manage-product',
                search: createSearchParams(searchParams).toString()
            })
        }
        else delete searchParams.q
        fetchProducts(searchParams)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, update, queriesQ])



    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                dispatch(showModal({
                    isOpenModal: true,
                    modalContent: <Loading />
                }))
                const response = await apiDeleteProduct(pid)
                dispatch(showModal({
                    isOpenModal: false,
                    modalContent: null
                }))
                if (response.success) {
                    render()
                    toast.success('Xoá sản phẩm thành công')
                } else toast.error('Xoá sản phẩm thất bại')
            }
        })
    }

    return (
        <div className='relative w-full px-4 py-2'>
            {editProduct && <div className='absolute inset-0 z-40 min-h-screen bg-gray-200'>
                <UpdateProduct
                    setEditProduct={setEditProduct}
                    editProduct={editProduct}
                    render={render}
                />
            </div>}
            {customizeVariants && <div className='absolute inset-0 z-40 min-h-screen bg-gray-200'>
                <CustomizeVariants
                    setCustomizeVariants={setCustomizeVariants}
                    customizeVariants={customizeVariants}
                    render={render}
                />
            </div>}

            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-2 border-b-2 border-gray-500'>
                <span>Danh sách sản phẩm</span>
            </h1>

            <div className='w-full p-4'>
                <div className='flex items-center gap-4 py-2'>
                    <InputField
                        nameKey={"q"}
                        value={queries.q}
                        setValue={setQueries}
                        isHideLabel={true}
                        // eslint-disable-next-line react/style-prop-object
                        style={'w500 bg-white text-black border-2 border-gray-300 placeholder:text-gray-500'}
                        placeholder={'Tìm kiếm sản phẩm...'}
                    />
                </div>

                <table className='w-full my-2 text-left table-auto'>
                    <thead className='font-bold text-center text-white bg-gray-700'>
                        <tr className='border border-gray-500'>
                            <th className='px-4 py-2'>#</th>
                            <th className='py-2'>Ảnh</th>
                            <th className='px-4 py-2'>Tên sản phẩm</th>
                            <th className='px-4 py-2'>Thương hiệu</th>
                            <th className='px-4 py-2'>Phân loại</th>
                            <th className='px-4 py-2'>Giá</th>
                            <th className='px-4 py-2'>Số lượng</th>
                            <th className='px-4 py-2'>Màu sắc</th>
                            <th className='px-4 py-2'>Đã bán</th>
                            <th className='px-4 py-2'>Đánh giá</th>
                            <th className='px-4 py-2'>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products?.map((el, index) => (
                            <tr key={el._id} className='text-center border border-gray-500 '>
                                <td className='px-2'>{((+params.get('page') ? +params.get('page') - 1 : 0) * process.env.REACT_APP_PRODUCTS_LIMIT) + 1 + index}</td>
                                <td className='flex justify-center'><img src={el.thumb} alt={el.title} className='object-cover w-16 h-16' /></td>
                                <td className='px-2'>{el.title}</td>
                                <td className='px-2'>{el.brand}</td>
                                <td className='px-2'>{el.category}</td>
                                <td className='px-2'>{`${formatMoney(el.price)}`}</td>
                                <td className='px-2'>{el.quantity}</td>
                                <td className='px-2'>{el.color}</td>
                                <td className='px-2'>{el.sold}</td>
                                <td className='px-2'>{el.totalRatings}</td>
                                <td className='px-2'>
                                    <button
                                        type="button"
                                        className={`px-4 py-2 rounded-md text-white bg-yellow-500 font-semibold hover:opacity-40 my-2 `}
                                        onClick={() => { setEditProduct(el) }}><FaEdit /></button>
                                    <button
                                        type='button'
                                        className={`ml-2 px-4 py-2 rounded-md text-white bg-main font-semibold my-2 hover:opacity-40`}
                                        onClick={() => handleDeleteProduct(el._id)}><FaTrashAlt /></button>
                                    <button
                                        type='button'
                                        className={`ml-2 px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2 hover:opacity-40`}
                                        onClick={() => setCustomizeVariants(el)}><BiSolidCustomize /></button>
                                </td>
                            </tr>
                        ))}
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

export default ManageProduct
