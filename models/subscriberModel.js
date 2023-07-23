const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const subscriberSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
});

//Export the model
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports  = {Subscriber}