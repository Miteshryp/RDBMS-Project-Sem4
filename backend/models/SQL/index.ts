import { PoolClient, Pool, QueryResult } from "pg";
import logger from "node-color-log";

// Pool
import poolSettings from "../../utils/poolSettings";
const pool: Pool = new Pool(poolSettings);

// Models
import Locations from "./View/Locations";
import Orders from "./View/Orders"
import Products from "./View/Products";
import Users from "./View/Users";

export default {
   
   // Used to execute transactions.
   async getClient () {
      try {
         let client = await pool.connect();
         return client;
      } catch( err ) {
         logger.error("ERROR: Cannot Allocate Client");
         return null;
      }
   },

   async queryWithParams (query, parameters) {
      try {
         let results = await pool.query(query, parameters);
         if(!results) {
            logger.error("Failed to fetch results");
            return null;
         }

         return results;

      } catch(err) {
         logger.error("ERROR while query")
         logger.warn(err.stack);
         throw err;
      }
   },

   async query (query) {
      try {
         let results = await pool.query(query);

         if(!results) {
            logger.error("Failed to fetch results");
            return null;
         }

         return results;

      } catch(err) {
         logger.error("ERROR while query")
         logger.warn(err.stack);
         throw err;
      }
   },

   async deleteTableData() {
      let client: PoolClient = await pool.connect();
      let wasSuccessful = false;

      try {
         let q1 = Users.getDeleteCommand(); //`DROP TABLE IF EXISTS User`
         let q2 = Locations.getDeleteCommand(); //`DROP TABLE IF EXISTS Location`
         let q3 = Products.getDeleteCommand(); //`DROP TABLE IF EXISTS Product`
         let q4 = Orders.getDeleteCommand(); //`DROP TABLE IF EXISTS Order`

         await client.query("BEGIN");

         let r1 = await client.query(q1);
         let r2 = await client.query(q2);
         let r3 = await client.query(q3);
         let r4 = await client.query(q4);

         await client.query("COMMIT");
         logger.warn("Table deleted successfully");
         wasSuccessful = true;

      } catch(err) {
         logger.warn("ERROR: Could not delete tables");
         logger.debug(err.stack);
         await client.query("ROLLBACK");
      } finally {
         client.release();
      }

      return wasSuccessful;
   },

   async initialiseTables() {
      let client: PoolClient = await pool.connect();
      let wasSuccessful = false;

      try {
         
         let q1 = Locations.getCreateCommand();//`CREATE TABLE IF NOT EXISTS Locations ( 
         //    location_id INT PRIMARY KEY,
         //    address_l1 VARCHAR(50) NOT NULL,
         //    address_l2 VARCHAR(30),
         //    address_l3 VARCHAR(30),
         //    landmark VARCHAR(30), 
         //    city VARCHAR(30) NOT NULL, 
         //    pincode NUMERIC(6) NOT NULL 
         // )`;
            
         let q2 = Products.getCreateCommand(); //`CREATE TABLE IF NOT EXISTS Products (
         //    product_id INT PRIMARY KEY,
         //    name VARCHAR(30) NOT NULL,
         //    category VARCHAR(20) NOT NULL,
         //    price DECIMAL NOT NULL
         // )`;
         
         let q3 = Users.getCreateCommand(); // `CREATE TABLE IF NOT EXISTS Users (
         //    user_id INT PRIMARY KEY NOT NULL,
         //    username VARCHAR(30) NOT NULL UNIQUE, 
         //    password VARCHAR(50) NOT NULL, 
             
         //    first_name VARCHAR(30) NOT NULL,
         //    middle_name VARCHAR(30),
         //    last_name VARCHAR(30) NOT NULL,
         //    dob DATE, 

         //    location_fk INT,
         //    FOREIGN KEY (location_fk) REFERENCES Locations(location_id) 
         // )`;
               
         let q4 = Orders.getCreateCommand(); //`CREATE TABLE IF NOT EXISTS Orders (
         //    order_id INT PRIMARY KEY,
         //    user_fk INT,
         //    product_fk INT,
         //    location_fk INT,
         //    FOREIGN KEY (user_fk) REFERENCES Users(user_id),
         //    FOREIGN KEY (product_fk) REFERENCES Products(product_id),
         //    FOREIGN KEY (location_fk) REFERENCES Locations(location_id)
         // )`;

         await client.query("BEGIN");

         // Creating tables
         let r1: QueryResult = await client.query(q1);
         logger.debug("1: ");
         let r2: QueryResult = await client.query(q2);
         logger.debug("2: ");
         let r3: QueryResult = await client.query(q3);
         logger.debug("3: ");
         let r4: QueryResult = await client.query(q4);
         logger.debug("4: ");

         logger.debug(r1.rowCount);

         let r = await client.query("COMMIT");
         logger.info("Tables initialised successfully.");
         wasSuccessful = true;
         
      } catch(err) {
         logger.error("Failed to initialise tables");
         logger.debug(err.stack);
         
         await client.query("ROLLBACK");
      } finally {
         client.release();
      }

      return wasSuccessful;
   }
};