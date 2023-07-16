const {handleRefreshToken } = require("../controllers/refresh.controller");

const router = require("express").Router();

router.route("/").get(handleRefreshToken);


module.exports = router