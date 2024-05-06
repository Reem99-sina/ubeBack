const express=require("express");
const { connectdb } = require("./connect");
const routeruSER = require("./router/user.router");
const app=express()
app.use(express.json())
require('dotenv').config();
app.use(express.json())
app.use("/user",routeruSER)
connectdb()
app.listen(1200,()=>{
    console.log("app listen 1200")
})