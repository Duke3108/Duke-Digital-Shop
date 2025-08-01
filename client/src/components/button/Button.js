import React, { memo } from 'react'

const Button = ({ onMouseEnter, onMouseLeave, name, handleOnClick, style, iconBefore, iconAfter, fw, type = 'button' }) => {
    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            type={type}
            className={style ? style : `px-4 py-2 rounded-md text-white bg-main font-semibold my-2 ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {iconBefore}
            <span>{name}</span>
            {iconAfter}
        </button>
    )
}

export default memo(Button)
