const { jwt, TokenExpiredError } = require("jsonwebtoken")


const generate_Token=(user)=>{
    return jwt.sign({
        id:user._id,
       
        Type:user.Type,
        
    },{
        expiresIn:'1d'
    },
    process.env.JWT_SECRET
)
}
module.exports={generate_Token};