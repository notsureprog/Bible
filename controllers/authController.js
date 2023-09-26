// const User = require('../models/userSchema')
const asyncHandler = require('express-async-handler');

exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User details")
})