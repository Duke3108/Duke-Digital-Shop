import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {
    return (
        <div className='w-full'>
            <input
                type={type || 'text'}
                className='w-full px-4 py-2 my-2 border rounded-sm'
                placeholder={nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
            />
        </div>
    )
}

export default InputField