import React, { memo } from 'react'
import { showModal } from '../store/appSlice'
import { useDispatch } from 'react-redux'

const Modal = ({ children }) => {
    const dispatch = useDispatch()
    return (
        <div
            onClick={() => dispatch(showModal({ isOpenModal: false, modalContent: null }))}
            className='absolute inset-0 z-50 flex items-center justify-center bg-overlay'>
            {children}
        </div>
    )
}

export default memo(Modal)
