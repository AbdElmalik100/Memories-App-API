import jwt from 'jsonwebtoken'


const authMiddleWare = (req, res, next) => {
    try {
        const [tokenType, token] = req.headers.authorization.split(" ")

        if (tokenType.toLowerCase() !== 'bearer' || !token) return res.status(401).json({ authorization: "you are not authorized to make this request" })

        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if (error) return res.status(403).json({ invalid_token: "token has been expired and no longer valid" })
            req.userInfo = data
            next()
        })
    } catch (error) {
        
    }
}


export default authMiddleWare