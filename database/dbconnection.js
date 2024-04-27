import mongoose from "mongoose";

export const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "HOSPITALCARE"
    }).then(() => {
        console.log('connected to database')
    }).catch((err) => {
        console.log(`Error : ${err}`);
    })
}