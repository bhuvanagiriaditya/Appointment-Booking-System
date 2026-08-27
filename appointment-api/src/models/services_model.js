const { default: mongoose } = require("mongoose");

const services=new mongoose.Schema(
    {
        service_name:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        }
        
       
       
       

    },
     {
            timestamps:true,
        }
)
module.exports=mongoose.model("services",services);