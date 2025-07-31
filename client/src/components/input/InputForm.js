import clsx from 'clsx'
import React, { memo } from 'react'

const InputForm = ({ readOnly, style, label, disabled, register, errors, id, validate, type = 'text', defaultValue, placeholder, fw }) => {
    return (
        <div className={clsx('flex flex-col gap-2', style)}>
            {label && <label className='font-semibold' htmlFor={id}>
                {label + ':'}
            </label>}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={clsx('my-auto max-h-[40px]', fw && 'w-full')}
                disabled={disabled}
                {...register(id, validate)}
                defaultValue={defaultValue}
                readOnly={readOnly}
            />
            {errors[id] && <small className='text-sm text-red-500'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(InputForm)
