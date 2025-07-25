import React, { useState } from 'react'
import Button from '../../components/Button'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            return
        }
        const response = await apiResetPassword({ password, token })
        if (response.success) {
            toast.success(response.mes, { theme: 'colored', hideProgressBar: true })
            setPassword('')
            setConfirmPassword('')
            navigate('/login')
        } else {
            toast.info(response.mes, { theme: 'colored', hideProgressBar: true })
        }
    }

    return (
        <div className='absolute top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center py-8 bg-white'>
            <div className='flex flex-col gap-4'>
                <label htmlFor='password'>Nhập mật khẩu mới</label>
                <input
                    type="text"
                    id='password'
                    className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                    placeholder='Ví dụ: abc123@'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label htmlFor='confirm-password'>Nhập lại mật khẩu mới</label>
                <input
                    type="text"
                    id='confirm-password'
                    className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                    placeholder='Ví dụ: abc123@'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className='flex items-center justify-between w-full'>

                    <Button
                        name='Đổi mật khẩu'
                        handleOnClick={handleResetPassword}
                        style={`px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2 w-fit`}
                    />

                </div>
            </div>
        </div>
    )
}

export default ResetPassword
