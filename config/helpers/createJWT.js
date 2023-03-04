const jwt = require("jsonwebtoken");
exports.createJWT = (userId)=>{
    return new Promise((resolve,reject)=>{
        jwt.sign({userId},process.env.SECRET_KEY,{
          expiresIn: "1d"  
        },(err,token)=>{
            if(err) return reject({ok:false,msg: "error token"});
              resolve({ok:true,response: token});
        })
    })
}