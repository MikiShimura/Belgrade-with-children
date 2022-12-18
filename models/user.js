const mongoose = require("mongoose"); 
const passportLocalMnogoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({ 
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMnogoose, {  
    errorMessages: { 
        UserExistsError : "The username already exist" 
    } 
})

module.exports = mongoose.model("User", userSchema);