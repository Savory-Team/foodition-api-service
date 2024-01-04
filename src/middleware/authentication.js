const jwt = require('jsonwebtoken')


const Authentication = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(400).json({ error: true, message: 'Token Tidak Valid' })
    jwt.verify(token, process.env.SECRET_KEY || 'SecretKeyAuth', (error, decoded) => {
        if (error) return res.status(401).json({ error: true, message: 'Token Kadaluarsa' })
        req.userID = decoded.USERID
        next()
    })
}

module.exports = Authentication