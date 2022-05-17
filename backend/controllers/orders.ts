import { Request, Response } from "express";
import logger from "node-color-log";
import serverResponse from "../utils/serverResponse";
import Orders from "../models/SQL/View/Orders";
import Products from "../models/SQL/View/Products";

export default {
   async getOrders(req: any, res: Response) {
      let userData = req.userData;

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


   async placeOrder(req: Request, res: Response) {
      let userData;
      let {productData} = req.body;

      let product = await Products.getProductDetails(productData.product_id);
      if(!product) {
         logger.error("Invalid productID.");
         return serverResponse.invalidParameter(res, "Invalid productID", {complete: true});
      }

      let orderInsertion = await Orders.insertOrder(userData, product);

      if(!orderInsertion) {
         logger.error("Order could not be placed.");
         return serverResponse.error(res, "Order could not be placed.", {complete: false});
      }

      return serverResponse.success(res, "Order placed successfully", {complete: true, payload: orderInsertion})
   }
}