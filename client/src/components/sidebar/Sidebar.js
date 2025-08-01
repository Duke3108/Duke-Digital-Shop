
import { NavLink } from 'react-router-dom'
import { createSlug } from '../../utils/helper'
import { useSelector } from 'react-redux'
import { memo } from 'react'
import { FaList } from "react-icons/fa";

const Sidebar = () => {
    const { categories } = useSelector(state => state.app)

    return (
        <div className='flex flex-col border'>
            <div className='flex py-[10px] px-5 font-semibold items-center text-[16px] text-white bg-main'>
                <span className='mr-2'><FaList /></span>
                <span>ALL COLLECTIONS</span>
            </div>
            {categories?.map(el => (
                <div className='flex items-center px-5 py-4' key={el._id}>
                    <img src={el?.image} alt="" className='w-6 h-6 mr-2' />
                    <NavLink
                        key={el.title}
                        to={createSlug(el.title)}
                        className={' text-sm hover:text-main'}
                    >
                        {el.title}
                    </NavLink>
                </div>
            ))}
        </div>
    )
}

export default memo(Sidebar)