import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js";


connectDB();

app.get("/",(req,res)=>{
    res.send("hello ji kese asd ho")
})


const port=config.PORT||3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
