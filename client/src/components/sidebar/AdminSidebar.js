import React, { Fragment, memo, useState } from 'react'
import logo from '../../assets/logo_white.png'
import { adminSidebar } from 'utils/constants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

// const activeStyle = 'px-4 py-2 flex gap-2 text-gray-200 font-semibold bg-gray-500'
// const notActiveStyle = 'px-4 py-2 flex gap-2 text-gray-200 font-semibold hover:bg-gray-600'
const activeStyle = 'px-4 py-3 flex gap-3 items-center rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 shadow'
const notActiveStyle = 'px-4 py-3 flex gap-3 items-center rounded-lg text-gray-300 hover:bg-zinc-700 transition duration-200'
const AdminSidebar = () => {

    const [actived, setActived] = useState([])
    const handleShowTab = (id) => {
        if (actived.some(activeId => activeId === id)) {
            setActived(prev => prev.filter(activeId => activeId !== id))
        } else {
            setActived(prev => [...prev, id])
        }
    }

    return (
        <div className='h-full px-4 py-6 shadow-lg bg-zinc-900'>
            <div className='flex flex-col items-center gap-2 mb-6'>
                <img src={logo} alt="logo" className='w-[180px] object-contain' />
                <small className='text-sm text-gray-400'>Admin Workspace</small>
            </div>
            <div className=''>
                {adminSidebar.map((item) => (
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

export default memo(AdminSidebar)
