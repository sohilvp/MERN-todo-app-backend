const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();

//middleware
dotenv.config();
app.use(cors({origin:'https://my-todo-listz.onrender.com',credentials: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/auth", require("./routes/auth"))
app.use("/refresh", require("./routes/refresh"))
app.use('/',require('./routes/user.routes'))
app.use('/',require('./routes/post.routes'))



mongoose
  .connect(process.env.MONGO_CONNECT_URI, {
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 4500);
    console.log(`database connected and running port ${process.env.PORT}`)
    
  })
  .catch((err) => console.log(err));
