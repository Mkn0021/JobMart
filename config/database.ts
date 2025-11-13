import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import env from './env';

const client = new MongoClient(env.MONGODB_URI);

export { client };

type CachedType = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongoose: CachedType | undefined;
}

const cached: CachedType = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(env.MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);

    } catch (e) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', e);
        throw e;
    }

    return cached.conn;
}

export function isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

export const mongoClient = new MongoClient(env.MONGODB_URI);
export default connectDB;