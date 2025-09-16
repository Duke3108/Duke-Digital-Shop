/* eslint-disable react/style-prop-object */
import React, { useState, useCallback, useEffect } from 'react'
import InputField from '../../components/input/InputField'
import Button from '../../components/button/Button'
import { apiForgotPassword, apiLogin, apiRegister } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import bg from '../../assets/bg_dark.png'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helper'
import { showModal } from 'store/appSlice'
import { Loading } from 'components'

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    name: '',
    mobile: ''
  })
  const [invalidFields, setInvalidFields] = useState([])
  const [isRegister, setIsRegister] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [searchParams] = useSearchParams()

  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      name: '',
      mobile: ''
    })
  }

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email })
    if (response.success) {
      toast.success(response.mes, { theme: 'colored', hideProgressBar: true })
      setIsForgotPassword(false)
      setEmail('')
    } else {
      toast.info(response.mes, { theme: 'colored', hideProgressBar: true })
    }
  }

  useEffect(() => {
    resetPayload()
  }, [isRegister])

  const handleSubmit = useCallback(async () => {
    const { name, mobile, ...data } = payload
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({ isOpenModal: true, modalContent: <Loading /> }))
        const response = await apiRegister(payload)
        dispatch(showModal({ isOpenModal: false, modalContent: null }))
        if (response.success) {
          Swal.fire('Đăng ký thành công', response.mes, 'success').then(() => {
            setIsRegister(false)
            resetPayload()
          })
        } else Swal.fire('Đăng ký thất bại', response.mes, 'error')
      } else {
        const rs = await apiLogin(data)
        if (rs.success) {
          dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
          if (searchParams.get('redirect')) {
            navigate(searchParams.get('redirect'))
          } else {
            navigate(`/${path.HOME}`)
          }
        } else Swal.fire('Đăng nhập thất bại', rs.mes, 'error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, isRegister])

  return (
    <div className='relative w-screen h-screen'>
      {isForgotPassword &&
        <div className='absolute top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center py-8 bg-white animate-slide-top'>
          <div className='flex flex-col gap-4'>
            <label htmlFor='email'>Nhập Email</label>
            <input
              type="text"
              id='email'
              className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
              placeholder='Ví dụ: email@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className='flex items-center justify-between w-full'>
              <Button
                name='back'
                handleOnClick={() => { setIsForgotPassword(false) }}

              />
              <Button
                name='submit'
                handleOnClick={handleForgotPassword}
                style={`px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2 w-fit`}
              />

            </div>
          </div>
        </div>
      }
      <img
        src={bg}
        alt=""
        className='object-cover w-full h-full'
      />
      <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
        <div className='p-8 bg-transparent border-2 border-white/20 backdrop-blur-[20px] flex flex-col items-center rounded-md min-w-[500px] shadow-[0_0_10px_rgba(0,0,0,0.2)] text-white'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</h1>
          {isRegister && <InputField
            style='placeholder:text-white text-white'
            value={payload.name}
            setValue={setPayload}
            nameKey='name'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fw={true}
          />}
          <InputField
            style='placeholder:text-white text-white'
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fw={true}
          />
          {isRegister && <InputField
            style='placeholder:text-white text-white'
            value={payload.mobile}
            setValue={setPayload}
            nameKey='mobile'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fw={true}
          />}
          <InputField
            style='placeholder:text-white text-white'
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fw={true}
          />
          <Button
            name={isRegister ? 'Đăng ký' : 'Đăng nhập'}
            handleOnClick={handleSubmit}
            fw
          />
          <div className='flex items-center justify-between w-full my-2 text-sm'>
            {!isRegister && <span onClick={() => { setIsForgotPassword(true); setEmail('') }} className='text-red-500 cursor-pointer hover:underline'>Quên mật khẩu ?</span>}
            {!isRegister && <span
              className='font-bold text-white cursor-pointer hover:underline'
              onClick={() => navigate(`/${path.HOME}`)}
            >
              Trang chủ
            </span>}
            {!isRegister && <span
              className='text-red-500 cursor-pointer hover:underline'
              onClick={() => setIsRegister(true)}
            >
              Tạo tài khoản
            </span>}

            {isRegister && <span
              className='w-full text-center text-red-500 cursor-pointer hover:underline'
              onClick={() => setIsRegister(false)}
            >
              Quay lại Đăng nhập
            </span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login