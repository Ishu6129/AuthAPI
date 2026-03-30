import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js";
import './src/queues/emailQueue.js';

connectDB();


app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/api/health",(req,res)=>{
    res.json({status:"ok"});
})

const port=config.PORT||3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
