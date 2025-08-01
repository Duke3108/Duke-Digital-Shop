import clsx from 'clsx'
import React, { memo } from 'react'

const SelectedOption = ({ icon, size, check }) => {
    return (
        <div
            className={clsx('flex items-center justify-center w-10 h-10 bg-white border rounded-full shadow-md cursor-pointer  hover:text-white',
                check ? 'hover:bg-gray-300 hover:border-gray-300' : 'hover:border-gray-800 hover:bg-gray-800',
            )}>
            {icon}
        </div>
    )
}

export default memo(SelectedOption)