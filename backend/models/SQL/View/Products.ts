import {QueryResult} from "pg"
import logger from "node-color-log";
import db from "../index"

export default {

   getCreateCommand() {
      return `CREATE TABLE IF NOT EXISTS ${process.env.PRODUCT_TABLE} (
         product_id INT SERIAL PRIMARY KEY,
         name VARCHAR(30) NOT NULL,
         category VARCHAR(20) NOT NULL,
         price DECIMAL NOT NULL
      )`;
   },

   getDeleteCommand() {
      return `DROP TABLE IF EXISTS ${process.env.PRODUCT_TABLE};`;
   },

   async getProductList() {
      let query = `SELECT * FROM ${process.env.PRODUCT_TABLE};`;
      try {
         let results: QueryResult = await db.query(query);

         if(!results) {
            logger.warn("Query from Product table failed.");
            return null;
         }
         return results.rows;
      } catch(err) {
         logger.error("Failed to fetch product list");
         return null;
      }
   },


   async createProduct(productData: {name: string, category: string, price: number}) {
      let q = `INSERT INTO ${process.env.PRODUCT_TABLE}(name, category, price) VALUES(
                  ${productData.name},
                  ${productData.category},
                  ${productData.price},
               ) RETURNING *`;

      try {
         let r = await db.query(q);

         if(!r) {
            logger.warn("Product table insertion failed.");
            return null;
         }

         return r.rows[0];
      } catch(err) {
         logger.error("Failed to insert product into Product table");
         logger.debug(err);

         return null;
      }
   }
}