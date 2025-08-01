import React, { memo } from 'react'
import Product from '../product/Product'
import Slider from "react-slick"

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};
const CustomSlider = ({ product, activeTab, normal }) => {
    return (
        <>
            {<Slider className='custom-slider' {...settings}>
                {product?.map((el, index) => (
                    <Product
                        key={index}
                        productData={el}
                        isNew={activeTab === 1 ? false : true}
                        normal={normal}
                    />
                ))}
            </Slider>}
        </>
    )
}

export default memo(CustomSlider)