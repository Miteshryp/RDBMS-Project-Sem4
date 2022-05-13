import {QueryResult} from "pg"
import logger from "node-color-log";
import db from "../index"

export default {
   async getProductList() {
      let query = "SELECT * FROM Product;";
      try {
         let results: QueryResult = await db.query(query);
         // results.
      } catch(err) {
         logger.error("Failed to fetch product list");
      }
   }
}