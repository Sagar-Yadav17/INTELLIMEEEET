import "dotenv/config";
export const ENV={
    PORT:process.env.PORT||5000,
    MONGO_URI:process.env.MONGO_URI||"random-mongo-uri",
    NODE_ENV:process.env.NODE_ENV
}