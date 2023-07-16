const User =require('../models/user.model')
const bcrypt =require('bcryptjs')

exports.createNewUser = async(req,res)=>{
    const {username, email,password} = req.body

    if(!username ||!email ||!password ) return res.status(400).json({'error':'All fields required'})
    const duplicate = await User.findOne({email}).exec()
    if(duplicate) return res.status(409).json({'error':'Email already registered'})
    try {
        const hashPassword = await bcrypt.hashSync(password)
        const user = await User.create({
            username,
            email,
            password:hashPassword
        })

        res.status(201).json({'message':'New User created'})
        
    } catch (error) {
        res.status(400).json(error.message)
    }
}


exports.logoutUser = async(req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken}).exec()

    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
     return res.sendStatus(204)
    }
    foundUser.refreshToken =foundUser.refreshToken.filter(rt=>rt !==refreshToken)
    await foundUser.save()

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
    return res.sendStatus(204)
}