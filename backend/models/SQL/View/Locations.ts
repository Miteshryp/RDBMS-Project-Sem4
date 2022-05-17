import logger from "node-color-log";
import { QueryResult } from "pg";
import db from "./../index"

export default  {

   // Used to create table in one transaction during DB initialisation.
   getCreateCommand() {
      return `CREATE TABLE IF NOT EXISTS ${process.env.LOCATION_TABLE} ( 
         location_id SERIAL PRIMARY KEY,
         address_l1 VARCHAR(50) NOT NULL,
         address_l2 VARCHAR(30),
         address_l3 VARCHAR(30),
         landmark VARCHAR(30), 
         city VARCHAR(30) NOT NULL, 
         pincode NUMERIC(6) NOT NULL 
      )`;
   },

   // Used to clean the data before creating the table in DB initialisation.
   getDeleteCommand: () => {
      return `DROP TABLE IF EXISTS ${process.env.LOCATION_TABLE}`;
   },

   // inserting new location 
   async createLocation(locationData: {address_l1: string, address_l2: string, address_l3: string, landmark: string, city: string, pincode: number }) {

      try {
         let location_insertion_query = `INSERT INTO ${process.env.LOCATION_TABLE}(address_l1, address_l2, address_l3, landmark, city, pincode) 
         VALUES(
            '${locationData.address_l1}',
            '${locationData.address_l2}', 
            '${locationData.address_l3}', 
            '${locationData.landmark}', 
            '${locationData.city}', 
            ${locationData.pincode}
         ) RETURNING *;`;

         let location_insertion_response: QueryResult = await db.query(location_insertion_query);
         if(!location_insertion_response) {
            logger.debug("Could not insert location.");
            return null;
         }

         return location_insertion_response.rows[0];
      } catch(err) {
         logger.error("Failed to insert into Location table.");
         logger.debug(err);

         return null;
      }
   }

   
}