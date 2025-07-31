/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import { apiUpdateProduct } from 'apis'
import { Button, InputForm, Loading, MarkdownEditer, Select } from 'components'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdCancel } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/appSlice'
import { fileToBase64, validate } from 'utils/helper'
import { FaChevronLeft } from "react-icons/fa6";

const UpdateProduct = ({ setEditProduct, editProduct, render }) => {

    const { categories } = useSelector(state => state.app)
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch } = useForm()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const [hoverElm, setHoverElm] = useState(null)

    const changeValue = useCallback((e) => {
        setPayload(e)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload])

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
            imagesPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (editProduct) {
            reset({
                title: editProduct?.title || '',
                price: editProduct?.price || '',
                quantity: editProduct?.quantity || '',
                color: editProduct?.color || '',
                category: editProduct?.category || '',
                brand: editProduct?.brand.toLowerCase() || ''
            })
            setPayload({
                description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description
            })
            setPreview({
                thumb: editProduct?.thumb || '',
                images: editProduct?.images || []
            })
        }
    }, [editProduct])

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewImages(watch('thumb')[0])
        }
    }, [watch('thumb')]);

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewMultipleImages(watch('images'))
        }
    }, [watch('images')]);

    const handleRemoveImage = (name) => {
        // if (preview.images?.some(img => img.name === name)) {
        //     const files = [...watch('images')];
        //     reset({ images: files.filter(img => img.name !== name) })
        //     setPreview(prev => ({
        //         ...prev,
        //         images: prev.images.filter(img => img.name !== name)
        //     }))
        // }
    }

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            const finalPayload = { ...data, ...payload }
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1])
            }
            finalPayload.images = data?.images?.length === 0 ? preview.images : data.images
            for (let image of finalPayload.images) {
                formData.append('images', image)
            }
            dispatch(showModal({ isOpenModal: true, modalContent: <Loading /> }))
            const response = await apiUpdateProduct(formData, editProduct._id)
            dispatch(showModal({ isOpenModal: false, modalContent: null }))
            if (response.success) {
                toast.success('Cập nhật sản phẩm thành công')
                render()
                setEditProduct(null)
            }
        }
    }

    return (
        <div className='relative w-full px-4 py-2 bg-gray-200'>
            <h1 className='h-[75px] flex gap-2 items-center text-3xl font-bold px-2 border-b-2 border-gray-500'>
                <span onClick={() => setEditProduct(null)} className='flex items-center justify-center w-10 h-10 cursor-pointer hover:rounded-full hover:bg-gray-300'><FaChevronLeft /></span>
                <span>Cập nhật sản phẩm</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label='Tên sản phẩm'
                        register={register}
                        errors={errors}
                        id={'title'}
                        validate={{ required: 'Yêu cầu nhập tên sản phẩm' }}
                        fw={true}
                        placeholder={'Nhập tên sản phẩm'}
                    />

                    <div className='flex w-full gap-4 my-6'>
                        <InputForm
                            label='Giá sản phẩm'
                            register={register}
                            errors={errors}
                            id={'price'}
                            validate={{ required: 'Yêu cầu nhập giá sản phẩm' }}
                            type='number'
                            placeholder={'Nhập giá sản phẩm'}
                            style='flex-auto'
                            fw={true}
                        />
                        <InputForm
                            label='Số lượng'
                            register={register}
                            errors={errors}
                            id={'quantity'}
                            validate={{ required: 'Yêu cầu nhập số lượng' }}
                            type='number'
                            placeholder={'Nhập số lượng'}
                            style='flex-auto'
                            fw={true}
                        />
                        <InputForm
                            label='Màu sắc'
                            register={register}
                            errors={errors}
                            id={'color'}
                            validate={{ required: 'Yêu cầu nhập màu sắc' }}
                            placeholder={'Nhập màu sắc'}
                            style='flex-auto'
                            fw={true}
                        />
                    </div>

                    <div className='flex w-full gap-4 my-6'>
                        <Select
                            label='Danh mục'
                            options={categories?.map(el => ({ code: el.title, value: el.title })).reverse()}
                            register={register}
                            errors={errors}
                            id={'category'}
                            defaultValue={categories?.find(el => el.title === editProduct.category)?.title}
                            fw={true}
                            style='flex-auto'
                        />
                        <Select
                            label='Thương hiệu'
                            options={categories?.find(el => el.title === watch('category'))?.brand?.map(brand => ({ code: brand.toLowerCase(), value: brand }))}
                            register={register}
                            defaultValue={categories
                                ?.find(el => el.title === watch('category'))?.brand
                                ?.find(brand => brand === editProduct?.brand)}
                            errors={errors}
                            id={'brand'}
                            fw={true}
                            style='flex-auto'
                        />
                    </div>

                    <div className='flex flex-col gap-2 my-6'>
                        <label className='font-semibold' htmlFor="thumb">Thumbnail cho sản phẩm</label>
                        <input
                            type="file"
                            id='thumb'
                            {...register('thumb')}
                        />
                        {errors['thumb'] && <small className='text-sm text-red-500'>{errors['thumb']?.message}</small>}
                    </div>
                    {preview.thumb && <div className='my-4'>
                        <img src={preview.thumb} alt="Preview Thumbnail" className='object-contain w-32 h-32' />
                    </div>}

                    <div className='flex flex-col w-full gap-2 my-6'>
                        <label className='font-semibold' htmlFor="images">Hình ảnh sản phẩm</label>
                        <input
                            type="file"
                            id='images'
                            multiple
                            {...register('images')}
                        />
                        {errors['images'] && <small className='text-sm text-red-500'>{errors['images']?.message}</small>}
                        {preview.images.length > 0 && <div className='flex flex-wrap w-full gap-4 my-4'>
                            {preview.images.map((img, index) => (
                                <div
                                    key={index}
                                    className='relative w-fit'
                                    onMouseEnter={() => setHoverElm(img)}
                                    onMouseLeave={() => setHoverElm(null)}
                                >
                                    {img !== '[object FileList]' && <img src={img} alt='images' className='object-contain w-32 h-32' />}
                                    {hoverElm === img && (
                                        <div
                                            onClick={() => handleRemoveImage(img.name)}
                                            className='absolute inset-0 flex justify-end rounded-lg cursor-pointer bg-overlay'>
                                            <MdCancel className='text-2xl text-red-500' />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>}
                    </div>

                    <MarkdownEditer
                        name={'description'}
                        changeValue={changeValue}
                        label={'Mô tả sản phẩm'}
                        invalidField={invalidFields}
                        setInvalidField={setInvalidFields}
                        value={payload.description}
                    />

                    <div className='flex items-center justify-center w-full gap-4 my-6 '>
                        <Button
                            name={'Cập nhật sản phẩm'}
                            type='submit'
                        />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default UpdateProduct
