import React, { memo } from 'react'
import Product from './Product'
import Slider from "react-slick"
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};
const CustomSlider = ({ product, activeTab }) => {
    return (
        <>
            {<Slider {...settings}>
                {product?.map((el, index) => (
                    <Product
                        key={index}
                        productData={el}
                        isNew={activeTab === 1 ? false : true}
                    />
                ))}
            </Slider>}
        </>
    )
}

export default memo(CustomSlider)