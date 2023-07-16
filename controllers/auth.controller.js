    const User = require("../models/user.model");
    const bcrypt =require('bcryptjs');
    const jwt = require('jsonwebtoken')
    exports.userLogin = async (req, res) => {
    const cookies = req.cookies

    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({ 'error': "Email and Password is required" })

        const foundUser = await User.findOne({email}).exec()
        const user = await User.findById(foundUser?.id,"-password -email -refreshToken")
        if(!foundUser) return res.status(400).json({'error':'User not found'})

        const match = await bcrypt.compareSync(password,foundUser.password)
        if(!match) return res.status(401).json({'error':'Wrong email or password '})

        const accessToken = jwt.sign({id:foundUser._id,username:foundUser.username},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
        const refreshToken = jwt.sign({username:foundUser.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1h'})
        
        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt=>rt !==cookies.jwt)
        
            if(cookies?.jwt){
            const refreshToken=cookies.jwt

            const foundToken = await User.findOne({refreshToken}).exec()

            if(!foundToken){
                newRefreshTokenArray=[]
            }
            res.clearCookie('jwt',{httpOnly:true,secure:true,sameSite:'None'})
        }
        foundUser.refreshToken =[...newRefreshTokenArray,refreshToken]
        await foundUser.save()

        res.cookie('jwt',refreshToken,{httpOnly:true,secure:true ,maxAge:24*60*60*1000,sameSite:'None'})
        return res.status(200).json({user,accessToken})
    };





