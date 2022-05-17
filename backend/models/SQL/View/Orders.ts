import logger from "node-color-log";
import db from "./../index"

export default {
   getCreateCommand() {
      return `CREATE TABLE IF NOT EXISTS Orders (
         order_id SERIAL PRIMARY KEY,
         user_fk INT,
         product_fk INT,
         location_fk INT,
         FOREIGN KEY (user_fk) REFERENCES Users(user_id),
         FOREIGN KEY (product_fk) REFERENCES Products(product_id),
         FOREIGN KEY (location_fk) REFERENCES Locations(location_id)
      )`;
   },

   getDeleteCommand() {
      return `DROP TABLE IF EXISTS Orders`;
   },


   async getUserOrders(userData) {
      let userID = userData.user_id;

      let order_query = `SELECT * FROM Orders 
      JOIN Users ON Users.user_id = user_fk
      JOIN Locations ON Locations.location_id = location_fk
      JOIN Products ON Products.product_id = product_fk
      
      WHERE (user_id=${userID});`;

      try {
      let order_results = await db.query(order_query);

      if(!order_results) 
         return null;
      return order_results.rows;
      
      } catch(err) {
         logger.error("Failed to select from Orders");
         logger.debug(err);
         return null;
      }
   },


   async insertOrder(userData: {user_id, location_fk}, productData: {product_id}) {

      let user_fk = userData.user_id;
      let location_fk = userData.location_fk;
      let product_fk = productData.product_id;

      if(!location_fk) {
         logger.warn("Cannot create an order without delivery location of the user. Get the user address.");
         return null;
      }
      if(!product_fk) {
         logger.warn("Invalid product data.");
         return null;
      }

      let q = `INSERT INTO ${process.env.ORDER_TABLE}(user_fk, product_fk, location_fk)
               VALUES(
                  ${user_fk}, 
                  ${product_fk}, 
                  ${location_fk}  
               ) RETURNING *;`;

               
      try {
         let r = await db.query(q);
         if(!r) {
            logger.warn("Order insertion failed.");
            return null;
         }
         return r.rows[0];
      } catch(err) {
         logger.error("Failed to insert order into Order table.");
         logger.debug(err);
         return null;
      }
   }
}