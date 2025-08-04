import { Product } from 'components'
import React from 'react'
import Masonry from 'react-masonry-css'
import { useSelector } from 'react-redux'
const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

const WishList = () => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='relative w-full px-4 py-2'>
            <header className='py-4 text-2xl font-semibold text-gray-800 border-b-2 border-gray-500'>
                Sản phẩm yêu thích
            </header>
            <div className='w-full gap-4 p-4 mx-auto '>
                {current?.wishlist?.length > 0
                    ?
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex my-masonry-grid "
                        columnClassName="my-masonry-grid_column">
                        {current?.wishlist.map((item, idx) => (
                            <div key={idx} className='w-full max-w-xs py-4 bg-white rounded-lg shadow-md hover:bg-gray-100'>
                                <Product productData={item} wishlist normal /></div>
                        ))}
                    </Masonry>


                    : <div className='flex items-center justify-center w-full h-[200px] text-2xl font-semibold text-gray-500'>
                        Chưa có sản phẩm yêu thích nào
                    </div>
                }
            </div>
        </div>
    )
}

export default WishList