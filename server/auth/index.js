const jwt = require("jsonwebtoken")

function authManager() {
    // Function ran in conjunction with none auth apis.
    verify = (req, res, next) => {
        try {
            const token = req.cookies.access_token
            if (!token) {
                res.locals.userId = null
            } else {
                const verified = jwt.verify(token, process.env.JWT_SECRET)
                req.userId = verified.userId
                res.locals.userId = verified.userId
            }

            next()
        } catch (err) {
            console.error("authManager::verify")
            console.error(err)
            return res.status(500).json({
                loggedIn: false,
                username: null,
                // errorMessage: "Unauthorized",
            })
        }
    }

    // Function used to verify user wiith auth apis
    verifyUser = (req) => {
        try {
            const token = req.cookies.access_token
            if (!token) {
                return null
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            return verified.userId
        } catch (err) {
            console.error("authManager::verifyUser")
            console.error(err)
            return null
        }
    }

    // Signs web token
    signToken = (userId) => {
        return jwt.sign({ userId: userId }, process.env.JWT_SECRET)
    }

    return this
}

const auth = authManager()
module.exports = auth
