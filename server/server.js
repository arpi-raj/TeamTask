require("dotenv").config();  
const express=require("express");
const cors=require("cors");
const app=express();
const authRoute=require("./router/auth-router");
const projectRoute=require("./router/project-router");
const taskRoute=require("./router/task-router");
const connectDb = require("./utils/db");
const errorMiddleWare = require("./middlewares/error-middleware");


const corsOptions={
    origin: "*",
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true
}
app.use(cors(corsOptions));

app.use(express.json());  

app.use("/api/auth",authRoute);  
app.use("/api/projects",projectRoute); 
app.use("/api/tasks",taskRoute);

app.use(errorMiddleWare);

const PORT=process.env.PORT || 5000;

connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Port is running at ${PORT}`);
    })
});

module.exports = app;
