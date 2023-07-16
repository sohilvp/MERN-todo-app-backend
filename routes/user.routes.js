const { createNewUser, logoutUser } = require('../controllers/user.controller')


const router = require('express').Router()


router.route('/register').post(createNewUser)
router.route('/logout').get(logoutUser)




module.exports =router