import clsx from 'clsx'
import React, { memo } from 'react'
import Select from 'react-select'

const CustomSelect = ({ wrapClassname, label, placeholder, onChange, options = [], value, classname }) => {
    return (
        <div className={`${wrapClassname}`}>
            {label && <label className='block mb-2 text-sm font-medium text-gray-700'>{label}</label>}
            <Select
                placeholder={placeholder}
                onChange={(val) => onChange(val)}
                options={options}
                value={value}
                isClearable
                isSearchable
                formatOptionLabel={(option) => (
                    <div className='flex items-center gap-2'>
                        {option.icon && <img src={option.icon} alt={option.label} className='w-5 h-5' />}
                        <span>{option.label}</span>
                    </div>
                )}
                className={{ control: () => clsx('border-2 py-1', classname) }}
            />
        </div>
    )
}

export default memo(CustomSelect)