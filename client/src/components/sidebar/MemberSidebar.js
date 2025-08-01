import clsx from 'clsx'
import React, { Fragment, memo, useState } from 'react'
import { memberSidebar } from 'utils/constants'
import avt from '../../assets/user.png'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoMdArrowBack } from 'react-icons/io'

const activeStyle = 'px-4 py-3 flex gap-3 items-center rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 shadow'
const notActiveStyle = 'px-4 py-3 flex gap-3 items-center rounded-lg hover:bg-gray-300 transition duration-200'

const MemberSidebar = () => {

    const { current } = useSelector(state => state.user)
    const [actived, setActived] = useState([])
    const navigate = useNavigate()

    const handleShowTab = (id) => {
        if (actived.some(activeId => activeId === id)) {
            setActived(prev => prev.filter(activeId => activeId !== id))
        } else {
            setActived(prev => [...prev, id])
        }
    }


    return (
        <div className='h-full px-4 shadow-lg bg-gray-100 w-[275px]'>
            <span onClick={() => navigate('/')} className='flex mx-[-12px] mt-2 items-center gap-2 p-2 rounded-full cursor-pointer hover:bg-gray-300 w-fit'><IoMdArrowBack />Trở về</span>
            <div className='flex flex-col items-center justify-center w-full gap-2 py-4'>
                <img src={current?.avatar || avt} alt="logo" className='object-cover w-[80px] h-[80px] rounded-full' />
                <small className='text-xl font-medium'>{current?.name}</small>
            </div>
            <div className=''>
                {memberSidebar.map((item) => (
                    <Fragment key={item.id}>
                        {item.type === 'single' && <NavLink
                            to={item.path}
                            className={({ isActive }) => clsx(isActive ? activeStyle : notActiveStyle)}
                        >
                            <span className='text-xl transition-transform duration-200 group-hover:scale-110'>{item.icon}</span>
                            <span>{item.text}</span>
                        </NavLink>}
                        {item.type === 'parent' && <div onClick={() => handleShowTab(item.id)} className='flex flex-col font-semibold text-gray-200'>
                            <div className='flex items-center gap-3 px-4 py-3 text-gray-300 transition duration-200 rounded-lg cursor-pointer hover:bg-zinc-700'>
                                <div className='flex items-center flex-1 gap-2'>
                                    <span>{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                                {actived.some(id => id === item.id) ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
                            </div>
                            {actived.some(id => id === item.id) && <div className='flex flex-col pl-4 ml-4 '>
                                {item.submenu.map((subItem) => (
                                    <NavLink
                                        key={subItem.id}
                                        to={subItem.path}
                                        onClick={(e) => e.stopPropagation()}
                                        className={({ isActive }) => clsx(isActive ? activeStyle : notActiveStyle, 'pl-4')}
                                    >
                                        <span>{subItem.text}</span>
                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(MemberSidebar)