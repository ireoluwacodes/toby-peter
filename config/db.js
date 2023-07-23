const mongoose = require('mongoose');

const selectDb = ()=>{
if (process.env.NODE_ENV == "production"){
    return process.env.MONGO_URL
}else{
    return process.env.LOCAL_MONGO_URL
}
}

const CreateDb = async ()=>{
 try {
    await  mongoose.connect(selectDb());
    
    console.log(`MongoDB Connection Succeeded at ${mongoose.connection.host}`)
 } catch (error) {
    console.log(error)
    process.exit(1)
 }
}

module.exports = {
    CreateDb
}