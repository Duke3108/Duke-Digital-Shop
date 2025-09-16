import React, { memo } from 'react'
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, style, invalidFields, setInvalidFields, isHideLabel, fw, placeholder }) => {
    return (
        <div className={clsx('relative flex flex-col mb-2', fw && 'w-full')}>
            {!isHideLabel && value && value?.trim() !== '' && <label className='absolute animate-slide-top-sm text-white top-0 left-3 px-1 block bg-transparent text-[10px]' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className={clsx(' w-full px-4 py-2 mt-2 mb-1 bg-transparent border-2 border-white rounded-sm outline-none placeholder:text-sm placeholder:italic', style)}
                placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                }}
            />
            {invalidFields?.some(el => el.name === nameKey)
                &&
                <small className='italic text-main'>{invalidFields.find(el => el.name === nameKey)?.mes}</small>
            }
        </div>
    )
}

export default memo(InputField)