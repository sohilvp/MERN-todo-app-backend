const { userLogin} = require("../controllers/auth.controller")
const router = require("express").Router()


router.route("/").post(userLogin)


module.exports = router;
