const { email } = require("zod");
const Auth=require("../models/auth_model");
const { generate_Token } = require("../../utils/jwt");


const Create_user=async (req,res)=>{
const {userName,password,Type,email}=req.body;
if(!userName || !password || !Type){
    return res.json({
        error:"all fields are required",
    })
}
const existing_user=await Auth.findOne({email});
if(existing_user){
    return res.json({
        err:"email is already existed"
    })
}

const user=await Auth.create({
    userName,
    password,
    Type,
    email,
})


return res.status(201).json({
    success:"registered sucessfully",



})

}
const User_login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"email and password is required"
            })
        }
        const user=await Auth.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"invalid credentials"

            })
        }
        const is_Match=await user.comparePassword(password);
        if(!is_Match){
            return res.status(401).json({
                message:"invalid credentials"

            })
        }
        const token=generate_Token(user);
        res.status(200).json({
            message:"login sucessfully",
            
        token,
        user : {
            userName:user.userName,
            id:user._id,
            email:user.email,
            Type:user.Type


        }
        }
    )
        
    }
    catch(err){
      res.status(500).json({ message: 'Login failed', error: err.message });
    }

}