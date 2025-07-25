import React, { memo } from 'react'
import icons from '../../utils/icons'

const { MdEmail } = icons
const Footer = () => {
    return (
        <div className='w-full'>
            <div className='h-[103px] w-full bg-main flex items-center justify-center'>
                <div className='flex items-center justify-between w-main'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>ĐĂNG KÝ NHẬN BẢN TIN</span>
                        <small className='text-[20px] text-gray-100'>Đăng ký ngay và nhận bản tin hàng tuần</small>
                    </div>
                    <div className='flex items-center flex-1'>
                        <input
                            className='p-4 pr-0 rounded-l-full w-full bg-[#F04646] outline-none text-gray-100 
                            placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50'
                            type='text'
                            placeholder='Địa chỉ email'
                        />
                        <div className='h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white'>
                            <MdEmail size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[407px] w-full bg-gray-900 flex items-center justify-center text-[13px] text-white'>
                <div className='flex w-main'>
                    <div className='flex flex-col gap-2 flex-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>GIỚI THIỆU</h3>
                        <span>
                            <span>Địa chỉ: </span>
                            <span className='opacity-70'>352 Hà Đặc, P.Trung Mỹ Tây, Q.12, Tp HCM</span>
                        </span>
                        <span>
                            <span>Số điện thoại: </span>
                            <span className='opacity-70'>0918516514</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className='opacity-70'>dukeshop@gmail.com</span>
                        </span>
                    </div>
                    <div className='flex flex-col flex-1 gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>THÔNG TIN</h3>
                        <span>Kiểu chữ</span>
                        <span>Danh sách sản phẩm</span>
                        <span>Vị trí cửa hàng</span>
                        <span>Ưu đãi hôm nay</span>
                        <span>Liên hệ</span>
                    </div>
                    <div className='flex flex-col flex-1 gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>CHÚNG TÔI LÀ</h3>
                        <span>Giúp đỡ</span>
                        <span>Miễn phí vận chuyển</span>
                        <span>Câu hỏi thường gặp</span>
                        <span>Trả lại & Trao đổi</span>
                        <span>Lời chứng thực</span>
                    </div>

                    <div className='flex-1'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>#DIGITALWORLDSTORE</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)