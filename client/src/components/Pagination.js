import usePagination from '../hook/usePagination'
import PageItem from './PageItem'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
    const pagination = usePagination(totalCount, 1)
    const [params] = useSearchParams()

    return (
        <div className='flex items-center justify-between w-main '>
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

export default Pagination
