import { Request, Response } from "express";
import logger from "node-color-log";
import serverResponse from "../utils/serverResponse";
import pool from "./../models/SQL"
import Orders from "../models/SQL/View/Orders";

export default {
   async getOrders(req: any, res: Response) {
      let userData = req.userData;


      // let query = `SELECT * FROM Orders 
      //             JOIN Users ON Users.user_id = user_fk
      //             JOIN Locations ON Locations.location_id = location_fk
      //             JOIN Products ON Products.product_id = product_fk;`

      // executing the query
      let results = await Orders.getUserOrders(userData); //pool.query(query);

      // If the result is null, query was unsuccessful.
      if(!results) {
         logger.error("Failed to execute [ORDER FETCH] Query");
         return serverResponse.error(res, "Failed to execute [ORDER FETCH] Query.", null);
      }
      logger.info(results);


      return serverResponse.success(res, "Fetched Orders Successfully", {data: results});
   },
}