import { apiDeleteUser, apiGetAllUsers, apiUpdateUser } from 'apis'
import React, { useCallback, useEffect, useState } from 'react'
import { blockStatus, roles } from 'utils/constants'
import moment from 'moment'
import { InputField, InputForm, Loading, Select } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { showModal } from 'store/appSlice'
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { TbEditOff } from "react-icons/tb";

const ManageUser = () => {

    const { handleSubmit, register, formState: { errors } } = useForm({
        email: '',
        name: '',
        mobile: '',
        role: '',
        isBlocked: '',
    })
    const dispatch = useDispatch()
    const [users, setUsers] = useState(null)
    const [update, setUpdate] = useState(false)
    const [queries, setQueries] = useState({
        q: ""
    })
    const [editUser, setEditUser] = useState(null)
    const [editing, setEditing] = useState(false)


    const fetchUsers = async (params) => {
        dispatch(showModal({
            isOpenModal: true,
            modalContent: <Loading />
        }))
        const response = await apiGetAllUsers({ ...params })
        dispatch(showModal({
            isOpenModal: false,
            modalContent: null
        }))
        if (response.success) setUsers(response)
    }

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const queriesDebounced = useDebounce(queries.q, 1000)
    useEffect(() => {
        const params = {}
        if (queriesDebounced) params.q = queriesDebounced
        fetchUsers(params)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queriesDebounced, update])

    const handleUpdateUser = async (data) => {
        dispatch(showModal({
            isOpenModal: true,
            modalContent: <Loading />
        }))
        const response = await apiUpdateUser(data, editUser._id)
        dispatch(showModal({
            isOpenModal: false,
            modalContent: null
        }))
        if (response.success) {
            setEditUser(null)
            render()
            toast.success('Cập nhật người dùng thành công')
        } else toast.error('Cập nhật người dùng thất bại')
    }

    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá người dùng này?',
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
                const response = await apiDeleteUser(uid)
                dispatch(showModal({
                    isOpenModal: false,
                    modalContent: null
                }))
                if (response.success) {
                    render()
                    toast.success('Xoá người dùng thành công')
                } else toast.error('Xoá người dùng thất bại')
            } else {
                dispatch(showModal({
                    isOpenModal: false,
                    modalContent: null
                }))
            }
        })
    }

    return (
        <div className='w-full px-4 py-2'>
            <h1 className='h-[70px] flex justify-between items-center text-3xl font-bold px-2 border-b-2 border-gray-500'>
                <span>Quản lý người dùng</span>
            </h1>
            <div className='w-full p-4'>
                <form onSubmit={handleSubmit(handleUpdateUser)}>
                    <div className='flex items-center gap-4 py-2'>
                        <InputField
                            nameKey={'q'}
                            value={queries.q}
                            setValue={setQueries}
                            isHideLabel={true}
                            // eslint-disable-next-line react/style-prop-object
                            style={'w500 bg-white text-black border-2 border-gray-300 placeholder:text-gray-500'}
                            placeholder={'Tìm kiếm người dùng...'}
                        />
                        {editUser && <button
                            onClick={() => { setEditUser(null); setEditing(false) }}
                            type='submit'
                            className='px-4 py-2 my-2 font-semibold text-white rounded-md bg-main'>
                            Lưu
                        </button>}
                    </div>

                    <table className='w-full my-2 text-left table-auto'>
                        <thead className='font-bold text-center text-white bg-gray-700'>
                            <tr className='border border-gray-500'>
                                <th className='px-4 py-2'>#</th>
                                <th className='px-4 py-2'>Email</th>
                                <th className='px-4 py-2'>Họ và Tên</th>
                                <th className='px-4 py-2'>Role</th>
                                <th className='px-4 py-2'>Số điện thoại</th>
                                <th className='px-4 py-2'>Trạng thái</th>
                                <th className='px-4 py-2'>Ngày tạo</th>
                                <th className='px-4 py-2'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {users?.users?.map((el, idx) => (
                                <tr key={el._id} className='border border-gray-500 '>
                                    <td className='px-4 py-2'>{idx + 1}</td>
                                    <td className='px-4 py-2'>
                                        {editUser?._id === el._id
                                            ? <InputForm
                                                defaultValue={el.email}
                                                fw={true}
                                                register={register}
                                                id={`email`}
                                                errors={errors}
                                                validate={{
                                                    required: 'Yêu cầu nhập email',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Địa chỉ email không hợp lệ"
                                                    }
                                                }}
                                            />
                                            : <span>{el.email}</span>}
                                    </td>
                                    <td className='px-4 py-2'>
                                        {editUser?._id === el._id
                                            ? <InputForm
                                                defaultValue={el.name}
                                                fw={true}
                                                register={register}
                                                id={`name`}
                                                errors={errors}
                                                validate={{ required: 'Yêu cầu nhập tên' }}

                                            />
                                            : <span>{el.name}</span>}
                                    </td>
                                    <td className='px-4 py-2'>
                                        {editUser?._id === el._id
                                            ? <Select
                                                defaultValue={el.role}
                                                options={roles}
                                                register={register}
                                                errors={errors}
                                                id={`role`}
                                                validate={{ required: 'Yêu cầu chọn role' }}
                                                fw={true}
                                            />
                                            : <span>{roles.find(role => role.code === el.role)?.value}</span>}
                                    </td>
                                    <td className='px-4 py-2'>
                                        {editUser?._id === el._id
                                            ? <InputForm
                                                defaultValue={el.mobile}
                                                fw={true}
                                                register={register}
                                                id={`mobile`}
                                                errors={errors}
                                                validate={{
                                                    required: 'Yêu cầu nhập số điện thoại',
                                                    maxLength: 10,
                                                    pattern: {
                                                        value: /^((\+84)|0)\d{9}$/,
                                                        message: "Số điện thoại không hợp lệ"
                                                    }
                                                }}
                                            />
                                            : <span>{el.mobile}</span>}
                                    </td>
                                    <td className='px-4 py-2'>
                                        {editUser?._id === el._id
                                            ? <Select
                                                options={blockStatus}
                                                defaultValue={el.isBlocked}
                                                register={register}
                                                errors={errors}
                                                id={`isBlocked`}
                                                validate={{ required: 'Yêu cầu chọn trạng thái' }}
                                                fw={true}
                                            />
                                            : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                                    </td>
                                    <td className='px-4 py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='flex justify-center gap-2'>
                                        {editUser?._id === el._id
                                            ? <button
                                                type="reset"
                                                className={`px-4 py-2 rounded-md text-white bg-main font-semibold my-2 `}
                                                onClick={() => { setEditUser(null); setEditing(false) }}><TbEditOff /></button>
                                            : <button
                                                type="button"
                                                className={`px-4 py-2 rounded-md text-white bg-yellow-500 font-semibold my-2 `}
                                                onClick={() => { setEditUser(el); setEditing(true) }}><FiEdit /></button>
                                        }
                                        {!editing && <button
                                            type='button'
                                            className={`ml-2 px-4 py-2 rounded-md text-white bg-red-500 font-semibold my-2 `}
                                            onClick={() => handleDeleteUser(el._id)}><FaTrashAlt /></button>}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default ManageUser
