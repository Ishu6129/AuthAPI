import dotenv from "dotenv";
dotenv.config();
if(!process.env.MONGO_URL){
    console.error("MONGOURL is not defined in environment variables");
    process.exit(1);
}
const config={
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL
}
export default config;