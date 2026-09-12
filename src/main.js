import express from "express";
import {bootstrapDB}  from './DB/connection.db.js'
import { globalErrorHandling } from './middleware/error.middleware.js';
import { authenticationController } from "./module/index.js";
const app = express()
const port = 3000;
app.use(express.json());
bootstrapDB(app, port);


app.use("/auth" ,authenticationController)
// app.use("/message",messageController);
// app.use("/users",userController);



app.all("/",(req,res)=>{res.send("Hello world" )})
app.all("/*dummy", (req, res) => {
  return res.status(404).json({
    message: "Invalid application routing / Route not found"
  });
});
app.use(globalErrorHandling);
