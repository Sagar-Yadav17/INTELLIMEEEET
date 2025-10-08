import mooongoose from 'mongoose';
import {ENV} from './env.js';

export const connectDB = async () => {
    try {
        const conn = await mooongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB Connected successfully", conn.connection.host);
    }
    catch(error){
        console.error("error:",error);
        process.exit(1);
    }
}
