import mongoose from 'mongoose'
import { DB_NAME } from '@/constants'

//NOTE - Connection Object to check if connection is established
type ConnectionObject = {
    isConnected?: number
}

//NOTE - Connection Object to check if connection is established
const connection: ConnectionObject = {}

const DB_URL = String(process.env.NEXT_PUBLIC_MONGO_URI) || ""

export async function dbConnect(): Promise<void> {
    //NOTE - Check if connection is already established
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    //NOTE - Check if database URL is provided
    if (!DB_URL) {
        console.error("No database URL provided");
        process.exit(1);
    }

    try {

        const db = await mongoose.connect(`${DB_URL}/${DB_NAME}`, {});

        //NOTE - Check if connection is established
        connection.isConnected = db.connections[0].readyState

        if (connection.isConnected === 1) {
            console.log();

            console.log("Successfully connected to the database");
            return;

        } else {
            console.error("Failed to connect to the database");
            process.exit(1);
        }

    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }

}