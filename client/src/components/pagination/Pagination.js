import { memo } from 'react'
import usePagination from '../../hooks/usePagination'
import PageItem from './PageItem'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

const Pagination = ({ totalCount }) => {
    const pagination = usePagination(totalCount, 1)
    const [params] = useSearchParams()

    return (
        <div className={clsx('flex items-center  w-full justify-between')}>
            {!+params.get('page') &&
                <span className='text-sm italic'>{`Hiển thị sản phẩm 1 - ${process.env.REACT_APP_PRODUCTS_LIMIT || 12} của tất cả ${totalCount} sản phẩm`}</span>
            }
            {+params.get('page') ?
                <span className='text-sm italic'>{`Hiển thị sản phẩm 
                    ${process.env.REACT_APP_PRODUCTS_LIMIT * (+params.get('page') - 1) + 1 || 12 * (+params.get('page') - 1) + 1} 
                    - ${Math.min(process.env.REACT_APP_PRODUCTS_LIMIT * +params.get('page'), totalCount) || Math.min(12 * +params.get('page'), totalCount)} 
                    của tất cả ${totalCount} sản phẩm`}</span>
                : null
            }
            <div className='flex items-center'>
                {pagination?.map((page, index) => (
                    <PageItem
                        key={index}>
                        {page}
                    </PageItem>
                ))}
            </div>
        </div>
    )
}

export default memo(Pagination)
