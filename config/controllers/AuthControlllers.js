const { request, response } = require("express");
const model_auth = require("../models/AuthModel");
const jwt = require("jsonwebtoken");
const {v4} = require("uuid");
const bcrypt = require("bcryptjs");
const { createJWT } = require("../helpers/createJWT");
const nodemailer = require("nodemailer");
const model_recoverPassword = require("../models/recoverPasswordModel");
const model_rol = require("../models/RolModel");
exports.user = async(req = request,res = response)=>{
    try {
         // usuario autenticado
         const user = await model_auth.findOne({
            where: {
               id: req.userId
            }
         })
         if(!user)  return res.status(400).json({ok:false,msg: "usuario no existente"})

        res.status(200).json({ok:true,user})
    } catch (error) {
        return res.status(500).json({msg: "error server"})
    }      
 }   


exports.signUp = async(req  = request,res = response)=>{
   try {
        
    const genSalt = await bcrypt.genSalt(9);
    req.body.password = await  bcrypt.hashSync(req.body.password,genSalt);
    const idGenerate = v4().substring(0,4);
    const user = await model_auth.create({id:idGenerate,...req.body});
    const token = await createJWT(user.id);
    if(!token.ok)  return res.status(400).json({msg: token.msg})

     res.status(200).json({ok:true,msg: "usuario creado",
     token: token.response});
   } catch (error) {
      console.log(error);
      res.status(500).json({msg: "error server"})
   }    
}
exports.signIn = async(req = request,res = response)=>{
    try {
      // verificamos si el usuario ah sido autenticado
      const userAuthenticated = await model_auth.findOne({
         where:{
            email: req.body.email
         }
      });
     

      if(!userAuthenticated) return res.status(400).json({ok:false,msg: "no existe usuario"})

      // verfiicamos contraseña valida
      const correctPasssword = await bcrypt.compareSync(req.body.password,userAuthenticated.password)

      if(!correctPasssword)  return res.status(400).json({ok:false,msg: "contraseña incorrecta"});
      

     // generamos un nuevo token
     const token = await createJWT(userAuthenticated.id);
     if(!token.ok)  return res.status(400).json({msg: token.msg})  

      res.status(200).json({ok:true,msg: "usuario logeado",token: token.response})
      

    } catch (error) {
      console.log(error);
      res.status(500).json({msg: "error server"})
    }    
 }


 exports.forgotPassword = async(req = request,res = response)=>{
    try {
      const user =await model_auth.findOne({
         where:{
            email: req.body.email
         }
      });
      if(!user) return res.status(400).json({ok:false,msg: "no existe usuario"});

         console.log(user.rolId);
   
        if(user.rolId === 1)  return res.status(400).json({msg: "contacta a a tu programador para recuperar contraseña"});


     
      

     const transporter =  nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'azahel.jesus.garcia@gmail.com',
           pass: 'ycezijdnawtlkemz'
         }
       });
       
      
       const tokenPassword = await jwt.sign({userId:user.id},`${process.env.SECRET_KEY}`,{
          expiresIn: "5m"
       });

        

       const link = `http://localhost:4000/api/auth/recoverPassword/${tokenPassword}`;

         

       const mailOptions = {
         from: 'azahel.jesus.garcia@gmail.com',
         to: user.email,
         subject: 'RECUPERACION DE CUENTA',
         text: `${link}`
       };
       
       transporter.sendMail(mailOptions,  async(error, info)=>{
         if (error) {
        console.log(error);
            return res.status(400).json({ok:false,msg:  "error al enviar el email"})
         } else {

           await  model_recoverPassword.create({token:tokenPassword});
           return  res.status(200).json({ok:true,msg:"se envio un correo electronico",token: tokenPassword})
         }
       });

      

    } catch (error) {

      console.log(error);
      res.status(500).json({msg: "error server"})
    }    
 }


 exports.resetPasswordGet = async(req = request,res = response)=>{
   
    // token existente para la recuoperacion de contraseña
    const user = await model_recoverPassword.findOne({
      where: {
         token: req.params.token
      }
   })
   if(!user)  return res.status(500).json({ok:false,msg: "token no registrado"})
   try {
   const currentUser =  jwt.verify(user.token,`${process.env.SECRET_KEY}`);
    const dataUser = await  model_auth.findOne({
       where: {
           id: currentUser.userId
       }
    })

     res.status(200).json({ok:true,msg: "contraseña editable",username: dataUser.username});
   } catch (error) {
      await  model_recoverPassword.destroy({
         where:{
            token: req.params.token
         }
      })
         return res.status(400).json({ok:false,msg: "token expirado"});
   }
   
 }

 exports.resetPassword = async(req = request,res = response)=>{
    const user = await model_recoverPassword.findOne({
      where: {
         token: req.params.token
      }
   })
   if(!user)  return res.status(500).json({ok:false,msg: "token no registrado"});
   const genSalt = await bcrypt.genSalt(9);
   req.body.password = await  bcrypt.hashSync(req.body.password,genSalt);
   try {
   const currentUser =  jwt.verify(user.token,`${process.env.SECRET_KEY}`);
    const dataUser = await  model_auth.findOne({
       where: {
           id: currentUser.userId
       }
    })
       
    await model_auth.update({password: req.body.password},{
       where:{id: dataUser.id}
    })


      await  model_recoverPassword.destroy({
         where: {
            token:  req.params.token
         }
      })
     res.status(200).json({ok:true,msg: "se restablecio una nueva contraseña"});
   
   } catch (error) {
      await  model_recoverPassword.destroy({
         where:{
            token: req.params.token
         }
      })
         return res.status(400).json({ok:false,msg: "token expirado"});
   }  
 }