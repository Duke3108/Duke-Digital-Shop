import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {
    return (
        <div className='relative flex flex-col w-full mb-2'>
            {value.trim() !== '' && <label className='absolute animate-slide-top-sm text-white top-0 left-3 px-1 block bg-transparent text-[10px]' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className='w-full px-4 py-2 mt-2 mb-1 bg-transparent border-2 border-black rounded-sm outline-none placeholder:text-white placeholder:text-sm placeholder:italic'
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            />
            {invalidFields?.some(el => el.name === nameKey)
                &&
                <small className='italic text-main'>{invalidFields.find(el => el.name === nameKey)?.mes}</small>
            }
        </div>
    )
}

export default InputField