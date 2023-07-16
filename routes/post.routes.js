const { getAllPost, createTodo, deleteTodo } = require('../controllers/post.controller')
const verifyJWT = require('../errorHandler/verifyJWT')
const router = require('express').Router()

router.use(verifyJWT)
router.route('/post/:id').get(getAllPost)
                         .post(createTodo)
                         .delete(deleteTodo)


module.exports =router