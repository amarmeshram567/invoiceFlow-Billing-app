


const errorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(err.status || 5000).json({
        message: err
    })
}