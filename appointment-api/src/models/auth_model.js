const { default: mongoose } = require("mongoose");
const { string } = require("zod");

const auth=mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Type:{
        enum:["admin","doctor","patient"],
        required:true
    }

},{
    timestamps:true
})
module.exports=mongoose.model("Auth",Auth);