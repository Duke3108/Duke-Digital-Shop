import clsx from 'clsx'
import React, { memo } from 'react'

const Select = ({ label, options = [], defaultValue, register, errors, id, validate, style, fw }) => {
    return (
        <div className={clsx('flex flex-col gap-2', style)}>
            {label && <label htmlFor={id}>{label}</label>}
            <select
                className={clsx('form-select', fw && 'w-full')}
                defaultValue={defaultValue}
                id={id}
                {...register(id, validate)}
            >
                {options?.map((option, index) => (
                    <option key={index} value={option.code}>
                        {option.value}
                    </option>
                ))}
            </select>
            {errors[id] && <small className='text-sm text-red-500'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(Select)
