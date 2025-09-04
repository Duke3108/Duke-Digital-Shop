import userRouter from "./user.js";
import productRouter from "./product.js";
import productCategoryRouter from "./productCategory.js";
import blogCategoryRouter from "./blogCategory.js"
import blogRouter from "./blog.js";
import brandRouter from "./brand.js";
import couponRouter from "./coupon.js"
import orderRouter from "./order.js";
import { errHandler, notFound } from "../middlewares/errorHandler.js";
import insertRouter from "./insert.js";

const initRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send('Duke Shop API is running');
    });
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/prodcate', productCategoryRouter)
    app.use('/api/blogcate', blogCategoryRouter)
    app.use('/api/blog', blogRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/coupon', couponRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/insert', insertRouter)

    app.use(notFound)
    app.use(errHandler)
}

export default initRoutes