import { Request, Response } from "express";
import logger from "node-color-log";
import serverResponse from "../utils/serverResponse";
import pool from "./../models/SQL"

export default {
   async getOrders(req: Request, res: Response) {
      let query = `SELECT * FROM Orders 
                  JOIN Users ON Users.user_id = Orders.user_fk
                  JOIN Locations ON Locations.location_id = Orders.location_fk
                  JOIN Products ON Products.product_id = Orders.product_fk;`

      // executing the query
      let r = await pool.query(query);

      // If the result is null, query was unsuccessful.
      if(!r) {
         logger.error("Failed to execute [ORDER FETCH] Query");
         return serverResponse.error(res, "Failed to execute [ORDER FETCH] Query.", null);
      }
      logger.info(r);


      return serverResponse.success(res, "Fetched Orders Successfully", {...r});
   },
}