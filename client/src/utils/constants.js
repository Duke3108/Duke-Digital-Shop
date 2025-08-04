import path from "./path";
import icons from './icons'
import { MdFavorite } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";

export const navigation = [
    {
        id: 5,
        value: 'TRANG CHỦ',
        path: `/${path.HOME}`
    },
    {
        id: 1,
        value: 'SẢN PHẨM',
        path: `products/all`
    },
    {
        id: 2,
        value: 'BLOG',
        path: `/${path.BLOGS}`
    },
    {
        id: 3,
        value: 'DỊCH VỤ',
        path: `/${path.SERVICE}`
    },
    {
        id: 4,
        value: 'CÂU HỎI',
        path: `/${path.FAQ}`
    },
]

const { BsShieldShaded,
    LuTruck,
    GoGift,
    FaReply,
    FaTty } = icons
export const extraInfomation = [
    {
        id: 1,
        title: 'Bảo đảm',
        icon: <BsShieldShaded />,
        sub: 'Kiểm tra chất lượng'
    },
    {
        id: 2,
        title: 'Vận chuyển',
        icon: <LuTruck />,
        sub: 'Giao hàng nhanh chóng'
    },
    {
        id: 3,
        title: 'Quà tặng đặc biệt',
        icon: <GoGift />,
        sub: 'Thẻ quà tặng đặc biệt'
    },
    {
        id: 4,
        title: 'Miễn phí trả hàng',
        icon: <FaReply />,
        sub: 'Trong vòng 7 ngày'
    },
    {
        id: 5,
        title: 'Tư vấn',
        icon: <FaTty />,
        sub: 'Phục vụ khách hàng 24/7'
    },
]

export const productInfomation = [
    {
        id: 1,
        name: 'MÔ TẢ',
        content: 'Đây là sản phẩm tuyệt vời mà bạn không thể bỏ qua!'
    },
    {
        id: 2,
        name: 'BẢO HÀNH',
        content: 'Sản phẩm được bảo hành trong vòng 12 tháng kể từ ngày mua hàng.'
    },
    {
        id: 3,
        name: 'VẬN CHUYỂN',
        content: 'Sản phẩm sẽ được giao hàng trong vòng 3-5 ngày làm việc.'
    },
    {
        id: 4,
        name: 'THANH TOÁN',
        content: 'Chúng tôi hỗ trợ nhiều hình thức thanh toán linh hoạt.'
    },

]

export const colors = [
    'black',
    'brown',
    'gray',
    'white',
    'pink',
    'yellow',
    'orange',
    'purple',
    'green',
    'blue',
]

export const sortOptions = [
    {
        id: 1,
        value: '-sold',
        text: 'Bán chạy nhất'
    },
    {
        id: 2,
        value: '-title',
        text: 'Bảng chữ cái, A-Z'
    },
    {
        id: 3,
        value: 'title',
        text: 'Bảng chữ cái, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Giá cao đến thấp'
    },
    {
        id: 5,
        value: 'price',
        text: 'Giá thấp đến cao'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Mới nhất'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Cũ nhất'
    }
]

export const voteOptions = [
    {
        id: 1,
        text: 'Rất tệ'
    },
    {
        id: 2,
        text: 'Tệ'
    },
    {
        id: 3,
        text: 'Bình thường'
    },
    {
        id: 4,
        text: 'Tốt'
    },
    {
        id: 5,
        text: 'Rất tốt'
    }
]

const { RiDashboardFill, FaUserGroup, FcMultipleDevices, FaCartShopping } = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <RiDashboardFill size={20} />
    },
    {
        id: 2,
        type: 'single',
        text: 'Người dùng',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <FaUserGroup size={20} />
    },
    {
        id: 3,
        type: 'parent',
        text: 'Sản phẩm',
        icon: <FcMultipleDevices size={20} />,
        submenu: [
            {
                text: 'Danh sách sản phẩm',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`
            },
            {
                text: 'Thêm sản phẩm',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            }
        ]
    },
    {
        id: 4,
        type: 'single',
        text: 'Đơn hàng',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <FaCartShopping size={20} />
    }
]

export const memberSidebar = [

    {
        id: 1,
        type: 'single',
        text: 'Người dùng',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <FaUserGroup size={20} />
    },
    {
        id: 2,
        type: 'single',
        text: 'Danh sách yêu thích',
        path: `/${path.MEMBER}/${path.WISH_LIST}`,
        icon: <MdFavorite size={20} />
    },
    {
        id: 3,
        type: 'single',
        text: 'Giỏ hàng',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <FaBasketShopping size={20} />
    },
    {
        id: 4,
        type: 'single',
        text: 'Lịch sử mua hàng',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <FaHistory size={20} />
    }
]

export const roles = [
    {
        label: 2904,
        value: 'User',
    },
    {
        code: 3108,
        value: 'Admin',
    },
]

export const blockStatus = [
    {
        code: true,
        value: 'Blocked',
    },
    {
        code: false,
        value: 'Active',
    },
]

export const orderStatus = [
    {
        label: 'Đã hủy',
        value: 'Cancelled',
    },
    {
        label: 'Đang chờ xử lý',
        value: 'Processing',
    },
    {
        label: 'Đã Thanh toán',
        value: 'Succeed',
    },
]