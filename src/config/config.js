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
if(!process.env.EMAIL_USER){
    console.error("EMAIL_USER is not defined in environment variables");
    process.exit(1);
}
if(!process.env.CLIENT_ID){
    console.error("CLIENT_ID is not defined in environment variables");
    process.exit(1);
}
if(!process.env.CLIENT_SECRET){
    console.error("CLIENT_SECRET is not defined in environment variables");
    process.exit(1);
}
if(!process.env.REFRESH_TOKEN){
    console.error("REFRESH_TOKEN is not defined in environment variables");
    process.exit(1);
}

const config={
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    EMAIL_USER:process.env.EMAIL_USER,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN
}
export default config;