import { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {

    const [debounceValue, setDebounceValue] = useState('')
    useEffect(() => {
        const setTimeOutId = setTimeout(() => {
            setDebounceValue(value)
        }, ms)

        return () => {
            clearTimeout(setTimeOutId)
        }
    }, [value, ms])

    return debounceValue
}

export default useDebounce

//khi nhập giá sẽ gọi api, chỉ gọi api khi người dùng nhập xong
//giải quyết vấn đề onChange khi nhập thay đổi liên tục => gọi api liên tục

//tách price thánh 2 biến
//1. biến cho UI, gõ tới dâu thì lưu tới đó
//2. biến dùng để call api => settimeout => biến gán sau 1 khoảng tgian