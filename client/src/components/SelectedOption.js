import React from 'react'

const SelectedOption = ({ icon }) => {
    return (
        <div className='flex items-center justify-center w-10 h-10 bg-white border rounded-full shadow-md cursor-pointer hover:border-gray-800 hover:bg-gray-800 hover:text-white'>
            {icon}
        </div>
    )
}

export default SelectedOption