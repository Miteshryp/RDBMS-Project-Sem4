import logger from "node-color-log";
import { Request, Response } from "express";

import User from "../models/SQL/View/Users"
import Customer from "../models/SQL/View/Users";
import serverResponse from "../utils/serverResponse";
import bcrypt from "bcrypt"
import Users from "../models/SQL/View/Users";
import jwt from "jsonwebtoken"

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
      let {userData, addressData} = req.body;

      // checking if the username is taken
      let result = await Users.getUserData(userData);
      if(result) {
         // username is taken
         logger.warn("Username already taken");
         return serverResponse.error(res, "Username already taken", {auth: false, complete: true});
      }

      // hashing the password.
      let hashedPassword = bcrypt.hash(userData.password, Number(process.env.SALT_ROUNDS));

      // storing the user data in the database.
      let user = await Users.insertUser({
         ...userData, password: hashedPassword
      }
      , addressData);

      // if user was not inserted - ERROR
      if(!user) {
         logger.warn("Could not create user");
         return serverResponse.error(res, "Failed to create user", {auth: false, complete: false});
      }

      // signup successful. Creating a token for the user.
      let token = jwt.sign({
         username: user.username,
         first_name: user.first_name,
         middle_name: user.middle_name,
         last_name: user.last_name,
         dob: user.dob
      }, String(process.env.PAYLOAD_SECRET));

      return serverResponse.success(res, "Signup Successful", {auth: true, complete: true, token});
   },

   async signin (req: Request, res: Response) {
      let {username, password} = req.body;

      // getting the user details.
      let user = await Customer.getUserData({username});
      if(!user) {
         // invalid username
         logger.error("Username not found");
         return serverResponse.invalidParameter(res, "Username", null);
      }

      // checking the password with the hashed password in the DB
      let checkPassword = await bcrypt.compare(password, user.password);

      if(!checkPassword) {
         //incorrect password
         return serverResponse.invalidParameter(res, "Invalid Password", {auth: false, complete: true});
      }

      // Correct password.
      let token = jwt.sign({
         username: user.username,
         first_name: user.first_name,
         middle_name: user.middle_name,
         last_name: user.last_name
      }, String(process.env.PAYLOAD_SECRET));

      return serverResponse.success(res, "Sign in successful", {auth: true, complete: true, token});
   }

}