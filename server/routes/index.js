import userRouter from "./user.js";
import { errHandler, notFound } from "../middlewares/errorHandler.js";

const initRoutes = (app) => {
    app.use('/api/user', userRouter)


    app.use(notFound)
    app.use(errHandler)
}

export default initRoutes