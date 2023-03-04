const { db } = require("../db/connectedDB");

class App{
   constructor(){
       this.express = require("express");
       this.app = this.express();
       this.cors = require("cors");
       require("dotenv").config();
   }   
   controllers(){
       this.app.set("port",process.env.PORT);
   }
   middlewares(){
      this.app.use(this.express.json());
      this.app.use(this.express.urlencoded({extended: false}))
      this.app.use(this.cors());
   }
   async connectDB(){
      db.authenticate().then(()=>{
          console.log("connected DB MYSQL")
      }).catch(err=>{
          console.log(err);
          console.log("Error DB")
      })   
   }
   routes(){
       this.app.use("/api/auth",require("../router/AuthRoute"))
   }
    listen(){
       this.app.listen(this.app.get("port"),()=>{
           console.log(`http://localhost:${this.app.get("port")}`)
       }) 
    }    
}

module.exports = App;