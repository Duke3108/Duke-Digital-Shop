import React, { memo } from 'react'

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select className='text-sm form-select' value={value} onChange={(e) => changeValue(e.target.value)}>
            <option value={''}>Xếp theo</option>
            {options.map((el, index) => (
                <option key={index} value={el.value}>
                    {el.text}
                </option>
            ))}
        </select>
    )
}

export default memo(InputSelect)
