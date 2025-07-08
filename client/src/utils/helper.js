import icons from './icons'

const { BsStar, BsStarFill, BsStarHalf } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

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