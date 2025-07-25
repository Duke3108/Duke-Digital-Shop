import icons from './icons'

const { BsStar, BsStarFill, BsStarHalf } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

export const formatPrice = number => Math.round(number / 1000) * 1000

export const renderStarFromNumber = (number, size) => {
    if (typeof number !== 'number' || number < 0) return

    const stars = []
    const fullStars = Math.floor(number)
    const decimal = number - fullStars
    const hasHalfStar = decimal >= 0.25 && decimal < 0.75 // tùy chỉnh ngưỡng sao nửa
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) stars.push(<BsStarFill key={i} color='orange' size={size || 16} />)
    if (hasHalfStar) stars.push(<BsStarHalf key={'half'} color='orange' size={size || 16} />)
    for (let i = 0; i < emptyStars; i++) stars.push(<BsStar key={`empty-${i}`} color='orange' size={size || 16} />)

    return stars
}

export function secondsToHms(d) {
    d = Number(d) / 1000
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)
    return ({ h, m, s })
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            if (setInvalidFields) {
                setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Trường này không được để trống' }])
            }
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                // eslint-disable-next-line no-useless-escape
                const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!arr[1].match(regexEmail)) {
                    invalids++
                    if (setInvalidFields) {
                        setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Email không hợp lệ' }])
                    }
                }
                break;
            case 'password':
                const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
                //Điều kiện:
                // Ít nhất 1 chữ thường
                // Ít nhất 1 chữ hoa
                // Ít nhất 1 số
                // Ít nhất 1 ký tự đặc biệt
                // Tối thiểu 8 ký tự
                if (!arr[1].match(regexPassword)) {
                    invalids++
                    if (setInvalidFields) {
                        setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Mật khẩu không hợp lệ' }])
                    }
                }
                break;
            default:
                break;
        }
    }
    return invalids
}

export const generateRange = (start, end) => {
    const length = end + 1 - start
    return Array.from({ length }, (_, i) => i + start)
}
