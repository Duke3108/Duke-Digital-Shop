import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import Swal from 'sweetalert2'

const FinalRegister = () => {
    const { status } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (status === 'failed') Swal.fire('Oops!', 'Đăng ký thất bại', 'error').then(() => {
            navigate(`/${path.LOGIN}`)
        })
        if (status === 'success') Swal.fire('Chúc mừng', 'Đăng ký thành công. Hãy đăng nhập', 'success').then(() => {
            navigate(`/${path.LOGIN}`)
        })
    }, [navigate, status])
    return (
        <div className='w-screen h-screen bg-gray-100'></div>
    )
}

export default FinalRegister
