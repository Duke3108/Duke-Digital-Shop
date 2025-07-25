import React, { memo } from 'react'

const Banner = () => {
    return (
        <div className='w-full'>
            <img
                src='https://4kwallpapers.com/images/wallpapers/asus-tuf-amoled-3840x2160-15698.png'
                alt='banner'
                className='h-[394px] object-cover w-full'
            />
        </div>
    )
}

export default memo(Banner)