import React, { memo } from 'react'
import clsx from 'clsx'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const PageItem = ({ children }) => {

    const [params] = useSearchParams()
    const navigate = useNavigate()
    const { category } = useParams()

    const handlePagination = () => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = i[1]
        if (Number(children)) queries.page = children
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }
    return (
        <button
            type='button'
            disabled={!Number(children)}
            onClick={handlePagination}
            className={clsx('flex justify-center w-10 h-10 items-center '
                , Number(children) && 'hover:rounded-full hover:bg-gray-200'
                , +params.get('page') === Number(children) && 'bg-gray-300 rounded-full'
                , !+params.get('page') && +children === 1 && 'bg-gray-300 rounded-full'
            )}>
            {children}
        </button>
    )
}

export default memo(PageItem)
