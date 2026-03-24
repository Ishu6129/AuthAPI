import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();
app.get("/",(req,res)=>{
    res.send("hello ji kese asd ho")
})


const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
