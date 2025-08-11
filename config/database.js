const mongoose= require("mongoose")

const dotenv= require("dotenv")

dotenv.config();
const dbURI= process.env.DB_URI
const connectdb= async()=> {
    try{
        await mongoose.connect(dbURI)
        console.log("----------------------------- Database connectied !")
    }catch(error){
        console.error('------------------------- MongoDB erro',error)
        process.exit(1)
    }
}
module.exports =connectdb;