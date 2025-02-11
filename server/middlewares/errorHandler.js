export const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalURL} is not found`)
    res.status(404)
    next(error)
}

export const errHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode // tra ve loi server or db
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

