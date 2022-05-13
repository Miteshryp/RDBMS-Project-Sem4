import logger from "node-color-log";
import { Request, Response } from "express";

import User from "../models/SQL/View/Users"
import Customer from "../models/SQL/View/Users";
import serverResponse from "../utils/serverResponse";
import bcrypt from "bcrypt"
// import Customer from "../models/Mongo/customer";

// GET routes
export default {
   async getDetails (req: Request, res: Response) {
      
      // TODO - Auth system
      // let user = await Customer.findOne({username: req.body.username });
      // if(!user) {
      //    logger.warn("User not found: " + req.body.username);
      //    return res.json({msg: "User not found"});
      // }
      let user: any = null;

      return res.json({msg: "User found", user});
   },



   // POST routes
   async signup (req, res) {
   
   },

   async signin (req: Request, res: Response) {
      let {username, password} = req.body;

      let user = await Customer.getUser({username});
      if(!user) {
         logger.error("Username not found");
         return serverResponse.invalidParameter(res, "Username", null);
      }

      let checkPassword = await bcrypt.compare(password, user.password);
   }

}