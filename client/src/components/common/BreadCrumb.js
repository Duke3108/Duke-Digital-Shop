import React, { memo } from 'react'
import useBreadcrumb from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import icons from '../../utils/icons'
const { IoIosArrowForward } = icons

const BreadCrumb = ({ title, category }) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },

    ];
    const breadcrumbs = useBreadcrumb(routes);
    return (
        <div className='flex items-center gap-1 text-sm text-gray-600'>
            {breadcrumbs?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link className='flex items-center gap-1 hover:text-main' key={match.pathname} to={match.pathname}>
                    <span className='capitalize'>{breadcrumb}</span>
                    {index < self.length - 1 && <IoIosArrowForward />}
                </Link>
            ))}
        </div>
    )
}

export default memo(BreadCrumb)
