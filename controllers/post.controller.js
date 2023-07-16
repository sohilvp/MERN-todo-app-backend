const Todo =require('../models/todo.model')
const User =require('../models/user.model')

exports.getAllPost = async(req,res)=>{

    const {id} = req.params
    try{

        if(!id) return res.status(404).json({'error':'Failed to load'})
        const foundUser = await User.findById(id).populate('todoId')
        if(!foundUser) return res.status(200).json({'message':'No todos found'})
        const allTodos = foundUser.todoId
        res.status(200).json({'todos':allTodos})

    }catch(error){

        res.json({error})

    }
}


////////////////////////////////////////////////

exports.createTodo = async(req,res)=>{

    const {title} = req.body
    const {id} = req.params
    try{

        if(!id) return res.status(404).json({'error':'Failed to load'})
        const foundUser = await User.findById(id)   
        const newTodo = await Todo.create({ title,userId:id})
        if(!newTodo) return res.status(400).json({'error':'Todo not created'})
        foundUser.todoId.push(newTodo._id)
        await foundUser.save()
        res.status(200).json({'message':'new Todo created'})

    }catch(error){
        
        res.json({error})
    }
}

////////////////////////////////////////////////

exports.deleteTodo = async(req,res)=>{

    const user =req.user
    const {id} = req.params
    try{

        if(!id) return res.status(404).json({'error':'Failed to load'})
        const foundTodo = await Todo.findByIdAndDelete(id)
        const foundUser = await User.findOne({username:user})
        const allTodo=  foundUser.todoId.filter(x=> x._id !== id)
        foundUser.todoId = allTodo
        await foundUser.save()
        res.status(200).json({'message':' Todo successfully deleted'})
        
    } catch(error){

        res.json({error})
    }
}