/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import { apiAddVariant } from 'apis'
import Button from 'components/button/Button'
import Loading from 'components/common/Loading'
import InputForm from 'components/input/InputForm'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaChevronLeft } from 'react-icons/fa6'
import { MdCancel } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/appSlice'
import Swal from 'sweetalert2'
import { fileToBase64 } from 'utils/helper'

const CustomizeVariants = ({ setCustomizeVariants, customizeVariants, render }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch
    } = useForm()
    const dispatch = useDispatch()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [hoverElm, setHoverElm] = useState(null)

    // const [payload, setPayload] = useState({
    //     description: ''
    // })
    // const [invalidFields, setInvalidFields] = useState([])

    // const changeValue = useCallback((e) => {
    //     setPayload(e)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [payload])


    const handlePreviewImages = async (file) => {
        const base64Thumb = await fileToBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewMultipleImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('Chỉ hỗ trợ định dạng hình ảnh PNG và JPEG')
                return;
            }
            const base64 = await fileToBase64(file)
            imagesPreview.push({ name: file.name, path: base64 })
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (watch('thumb').length > 0) {
            handlePreviewImages(watch('thumb')[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('thumb')]);

    useEffect(() => {
        if (watch('images').length > 0) {
            handlePreviewMultipleImages(watch('images'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('images')]);

    const handleSubmitVariants = async (data) => {
        if (data.color === customizeVariants?.color || data.title === customizeVariants?.title) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Tên hoặc màu biến thể đã tồn tại',
                icon: 'warning',
                confirmButtonText: 'OK'
            })
        } else {
            const formData = new FormData()
            for (let i of Object.entries(data)) {
                formData.append(i[0], i[1])
            }
            if (data.thumb) {
                formData.append('thumb', data.thumb[0])
            }
            if (data.images) {
                for (let image of data.images) {
                    formData.append('images', image)
                }
            }
            dispatch(showModal({ isOpenModal: true, modalContent: <Loading /> }))
            const response = await apiAddVariant(customizeVariants?._id, formData)
            dispatch(showModal({ isOpenModal: false, modalContent: null }))
            if (response.success) {
                toast.success('Thêm biến thể thành công')
                reset()
                setPreview({ thumb: null, images: [] })
                setCustomizeVariants(null)
                render()
            } else {
                toast.error('Thêm biến thể thất bại')
            }
        }
    }

    useEffect(() => {
        reset(
            {
                title: customizeVariants?.title || '',
                price: customizeVariants?.price || '',
                color: customizeVariants?.color || '',
            }
        )
        // setPayload({
        //     description: typeof customizeVariants?.description === 'object' ? customizeVariants?.description?.join(', ') : customizeVariants?.description
        // })
    }, [customizeVariants])

    return (
        <div className='relative w-full px-4 py-2 bg-gray-200'>
            <h1 className='h-[75px] flex gap-2 items-center text-3xl font-bold px-2 border-b-2 border-gray-500'>
                <span onClick={() => setCustomizeVariants(null)} className='flex items-center justify-center w-10 h-10 cursor-pointer hover:rounded-full hover:bg-gray-300'><FaChevronLeft /></span>
                <span>Biến thể</span>
            </h1>

            <form onSubmit={handleSubmit(handleSubmitVariants)} className='flex flex-col w-full gap-4 p-4 mt-4'>
                <div className='flex items-center w-full gap-4 '>
                    <InputForm
                        label={'Tên sản phẩm'}
                        register={register}
                        errors={errors}
                        id={'title'}
                        validate={{
                            required: 'Tên biến thể không được để trống',
                        }}
                        fw={true}
                        placeholder={'Nhập tên biến thể...'}
                        style='flex-auto'
                    />
                    {/* <InputForm
                        label={'Giá gốc'}
                        register={register}
                        errors={errors}
                        id={'price'}
                        fw={true}
                        readOnly={true}
                        disabled={true}
                        style='flex-auto'
                    />
                    <InputForm
                        label={'Màu gốc'}
                        register={register}
                        errors={errors}
                        id={'color'}
                        fw={true}
                        readOnly={true}
                        disabled={true}
                        style='flex-auto'
                    /> */}
                </div>

                <div className='flex items-center w-full gap-4 '>
                    <InputForm
                        label={'Giá biến thể'}
                        register={register}
                        errors={errors}
                        id={'price'}
                        validate={{
                            required: 'Giá biến thể không được để trống',
                        }}
                        fw={true}
                        placeholder={'Nhập giá biến thể...'}
                        type='number'
                        style='flex-auto'
                    />
                    <InputForm
                        label={'Màu biến thể'}
                        register={register}
                        errors={errors}
                        id={'color'}
                        validate={{
                            required: 'Màu biến thể không được để trống',
                        }}
                        fw={true}
                        placeholder={'Nhập màu biến thể...'}
                        style='flex-auto'
                    />
                    <InputForm
                        label={'Số lượng biến thể'}
                        register={register}
                        errors={errors}
                        id={'quantity'}
                        validate={{
                            required: 'Số lượng biến thể không được để trống',
                        }}
                        fw={true}
                        type='number'
                        placeholder={'Nhập số lượng biến thể...'}
                        style='flex-auto'
                    />
                </div>

                <div className='flex flex-col gap-2 my-2'>
                    <label className='font-semibold' htmlFor="thumb">Thumbnail cho sản phẩm</label>
                    <input
                        type="file"
                        id='thumb'
                        {...register('thumb', { required: 'Yêu cầu chọn thumbnail cho sản phẩm' })}
                    />
                    {errors['thumb'] && <small className='text-sm text-red-500'>{errors['thumb']?.message}</small>}
                </div>
                {preview.thumb && <div>
                    <img src={preview.thumb} alt="Preview Thumbnail" className='object-contain w-32 h-32' />
                </div>}

                <div className='flex flex-col w-full gap-2 my-4'>
                    <label className='font-semibold' htmlFor="images">Hình ảnh sản phẩm</label>
                    <input
                        type="file"
                        id='images'
                        multiple
                        {...register('images', { required: 'Yêu cầu chọn hình ảnh cho sản phẩm' })}
                    />
                    {errors['images'] && <small className='text-sm text-red-500'>{errors['images']?.message}</small>}
                    {preview.images.length > 0 && <div className='flex flex-wrap w-full gap-4 my-2'>
                        {preview.images.map((img, index) => (
                            <div
                                key={index}
                                className='relative w-fit'
                                onMouseEnter={() => setHoverElm(img.name)}
                                onMouseLeave={() => setHoverElm(null)}
                            >
                                <img src={img.path} alt='images' className='object-contain w-32 h-32' />
                                {hoverElm === img.name && (
                                    <div
                                        className='absolute inset-0 flex justify-end rounded-lg cursor-pointer bg-overlay'>
                                        <MdCancel className='text-2xl text-red-500' />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>}
                </div>

                {/* <MarkdownEditer
                    name={'description'}
                    changeValue={changeValue}
                    label={'Mô tả sản phẩm'}
                    invalidField={invalidFields}
                    setInvalidField={setInvalidFields}
                    value={payload.description}
                    placeholder={'Nhập mô tả biến thể sản phẩm...'}
                /> */}

                <div className='flex items-center justify-center w-full mt-8'>
                    <Button
                        name={'Thêm biến thể cho sản phẩm'}
                        type='submit'
                    />
                </div>
            </form>
        </div>
    )
}

export default memo(CustomizeVariants)
