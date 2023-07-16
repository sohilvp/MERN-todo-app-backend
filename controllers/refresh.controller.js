const User = require("../models/user.model")
const jwt = require('jsonwebtoken')


exports.handleRefreshToken = async (req, res) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({'error':'Unauthorized'})
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    const foundUser = await User.findOne({ refreshToken }).exec()

    // Detected refresh token reuse!
    
    if (!foundUser) {    
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
    
                if (err) return res.status(403).json({'message':"User not found"})
                const hackedUser = await User.findOne({ username: decoded.username }).exec()
                hackedUser.refreshToken = []
                const result = await hackedUser.save()

            }
        )

        return res.sendStatus(403)
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken)

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray]
                 await foundUser.save()
            }
            
            if ( err || foundUser.username !== decoded.username) return res.status(403)
            
            const accessToken = jwt.sign(
                {id:decoded._id,username:decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            )

            const newRefreshToken = jwt.sign(
                { username: decoded.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1h' }
            )
            
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            await foundUser.save();

            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
            res.json({'id':foundUser._id,'name':foundUser.username, 'accessToken':accessToken })
        }
    )
}