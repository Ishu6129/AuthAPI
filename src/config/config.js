import dotenv from "dotenv";
dotenv.config();
if(!process.env.MONGO_URL){
    console.error("MONGOURL is not defined in environment variables");
    process.exit(1);
}
if(!process.env.PORT){
    console.error("PORT is not defined in environment variables");
    process.exit(1);
}
if(!process.env.JWT_SECRET){
    console.error("JWT_SECRET is not defined in environment variables");
    process.exit(1);
}
const config={
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET
}
export default config;