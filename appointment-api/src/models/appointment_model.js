const { default: mongoose } = require("mongoose");

const appointment=new mongoose.Schema(
    {
        customer_name:{
            type:String,
            required:true,
        },
        
        customer_email:{
            type:String,
            required:true,
        },
         services:{
            type:String,
            required:true,
        },
        appointment_date:{
            type:String,
            required:true,


        },
        time_slot:{
            type:String,
            required:true,

        },
        status:{
            type:String,
            enum:["booked","cancled"],
            default:"booked",

        },
       

    },
     {
            timestamps:true,
        }
)
module.exports=mongoose.model("appointment",appointment);