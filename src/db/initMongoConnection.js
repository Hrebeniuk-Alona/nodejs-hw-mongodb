import mongoose from "mongoose";
import {getEnvVar } from "../utils/getEnvVar.js";



export const initMongoConnection = async () => {
        try {
        const user = getEnvVar('MONGODB_USER');
        const pwd = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');
        const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

        await mongoose.connect(uri);

        console.log("Mongo connection successfully established!");
    }
    catch (error) {
        console.error(error);
        throw (error);
    }
};




// MqLzDd5S77DFR4mv

// student116