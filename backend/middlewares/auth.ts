import express, {Request, Response, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import logger from "node-color-log";

import server from "./../utils/serverResponse"

export default {
   async verifyUser(req, res: Response, next: NextFunction) {
      let token: string = String(req.headers['x-access-token']);

      jwt.verify(token, process.env.SECRET, async (err, data: JwtPayload) => {
         if(err) {
            logger.error("Invalid token supplied.");
            return server.invalidParameter(res, "token", null);
         }

         let user = {
            username: data.username, 
            first_name: data.first_name, 
            middle_name: data.middle_name,
            last_name: data.last_name
         }

         logger.info("Verification successful")

         req.user = user;
         next();
      })
   }
}