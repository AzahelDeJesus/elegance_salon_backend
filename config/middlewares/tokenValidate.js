const { request, response } = require("express")
const jwt = require("jsonwebtoken");
exports.validateToken = (req = request,res = response,next)=>{
    const token = req.header("x_token");


    if(!token)  return res.status(400).json({msg: "no existe token"});

    try {
        const user = jwt.verify(token,process.env.SECRET_KEY);

        req.userId = user.userId;

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false,msg: "token no valido o expirado"})
    }
}