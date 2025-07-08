import React, { useState } from 'react'
import InputField from '../../components/InputField'

const Login = () => {

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    name: ''
  })

  return (
    <div className='relative w-screen h-screen'>
      <img
        src="https://i.imgur.com/81RTZEw.png"
        alt=""
        className='object-cover w-full h-full'
      />
      <div className='absolute top-0 bottom-0 left-0 flex items-center justify-center right-1/2'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md minw-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>ĐĂNG NHẬP</h1>
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
          />
        </div>
      </div>
    </div>
  )
}

export default Login