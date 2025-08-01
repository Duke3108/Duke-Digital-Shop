import { Button, InputForm, Loading } from 'components'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import avt from '../../assets/user.png'
import { apiUpdateCurrentUser } from 'apis'
import { getCurrentUser } from 'store/user/asyncAction'
import { toast } from 'react-toastify'
import { showModal } from 'store/appSlice'
import { fileToBase64 } from 'utils/helper'

const Personal = () => {

    const { current } = useSelector(state => state.user)
    const [currentImage, setCurrentImage] = useState(current?.avatar || avt)
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm()

    useEffect(() => {
        reset({
            name: current?.name || '',
            email: current?.email || '',
            mobile: current?.mobile || '',
            address: current?.address || '',

        })
    }, [current, reset])

    const handlePreviewImages = async (file) => {
        const base64Thumb = await fileToBase64(file)
        setCurrentImage(base64Thumb)
    }

    useEffect(() => {
        if (watch('avatar')?.length > 0) {
            handlePreviewImages(watch('avatar')[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('avatar')]);


    const handleUpdateInfo = async (data) => {
        const formData = new FormData();
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
            delete formData.avatar;
        }
        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1]);
        }
        dispatch(showModal({ isOpenModal: true, modalContent: <Loading /> }))
        const response = await apiUpdateCurrentUser(formData);
        dispatch(showModal({ isOpenModal: false, modalContent: null }))
        if (response.success) {
            dispatch(getCurrentUser())
            toast.success('Cập nhật thành công');
        } else {
            toast.error('Cập nhật thất bại');
        }

    }

    return (
        <div className='relative w-full px-4'>
            <header className='py-4 text-2xl font-semibold text-gray-800 border-b-2 border-gray-500'>
                Thông tin cá nhân
            </header>
            <form onSubmit={handleSubmit(handleUpdateInfo)} className='flex flex-col w-3/5 gap-6 py-4 mx-auto mt-4'>
                <label htmlFor='avatar' className='flex items-center justify-center w-full cursor-pointer'>
                    <img src={currentImage} alt="logo" className='rounded-full object-cover w-[100px] h-[100px]' />
                </label>
                <input type="file" id="avatar" {...register('avatar')} hidden />
                <InputForm
                    label={'Tên'}
                    register={register}
                    errors={errors}
                    id={'name'}
                    validate={{ required: 'Tên không được để trống' }}
                />
                <InputForm
                    label={'Email'}
                    register={register}
                    errors={errors}
                    id={'email'}
                    validate={{
                        required: 'Yêu cầu nhập email',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Địa chỉ email không hợp lệ"
                        }
                    }}
                />
                <InputForm
                    label={'Số điện thoại'}
                    register={register}
                    errors={errors}
                    id={'mobile'}
                    validate={{
                        required: 'Yêu cầu nhập số điện thoại',
                        maxLength: 10,
                        pattern: {
                            value: /^(0(3|5|7|8|9)\d{8}|84(3|5|7|8|9)\d{8}|\+84(3|5|7|8|9)\d{8})$/,
                            message: 'Số điện thoại không hợp lệ'
                        }
                    }}
                />
                <InputForm
                    label={'Địa chỉ'}
                    register={register}
                    errors={errors}
                    id={'address'}
                />
                <div className='flex items-center gap-2'>
                    <span className='font-semibold'>Trạng thái: </span>
                    <span>{current?.isBlocked ? "Đã bị chặn" : "Đang hoạt động"}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-semibold'>Role: </span>
                    <span>{current?.role === 2904 ? "Khách" : "Admin"}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-semibold'>Ngày tham gia: </span>
                    <span>{moment(current?.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                {isDirty && <div className='flex items-center justify-center gap-2'>
                    <Button
                        name={'Cập nhật'}
                        type='submit'
                        className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
                    />
                </div>}
            </form>
        </div>
    )
}

export default Personal
