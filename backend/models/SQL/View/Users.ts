import logger from "node-color-log";
import { QueryResult } from "pg";

import Locations from "./Locations";

import db from "../index";

// User Schema
/*
  username,
  password,
  first_name,
  middle_name,
  last_name,
  dob,
  location_fk
*/

interface UserDataSchema {
  first_name: string,
  last_name: string,
  dob: string,

  
}

export default {

  getCreateCommand() {
    return `CREATE TABLE IF NOT EXISTS ${process.env.USER_TABLE} (
          user_id INT PRIMARY KEY SERIAL NOT NULL,
          username VARCHAR(30) NOT NULL UNIQUE, 
          password VARCHAR(50) NOT NULL, 
      
          first_name VARCHAR(30) NOT NULL,
          middle_name VARCHAR(30),
          last_name VARCHAR(30) NOT NULL,
          dob DATE,

          location_fk INT,
          FOREIGN KEY (location_fk) REFERENCES ${process.env.LOCATION_TABLE}(location_id) 
       )`;
  },


  getDeleteCommand() {
    return `DROP TABLE IF EXISTS ${process.env.USER_TABLE}`;
  },




  // User data functions
  async getUserList() {

    // select all fields from user table
    let q = `SELECT * FROM ${process.env.USER_TABLE}`;
    
    try {
      // process query
      let res = await db.query(q);
      if(!res) {
        // no user found
        logger.error("No response on list query");
        return null;
      }

      // if found, return the fetched list.
      return res;

    } catch(err) {
      // error in executing query.
      logger.error("Cannot fetch user list");
      return null;
    }
  },

  async getUserData(parameters) {

    // if user_id exists in the parameters, we use the user_id to search the user.
    // if not, we resort to username
    let q = parameters.user_id 
              ? 
              `SELECT * FROM ${process.env.USER_TABLE} WHERE (user_id=${parameters.user_id})`
              : 
              `SELECT * FROM ${process.env.USER_TABLE} WHERE (username=${parameters.username})`
            ;

    try {
      let res: QueryResult = await db.query(q);

      if (!res) {
        logger.error(`Failed to fetch User info: ${parameters.username}`);
        return null;
      }

      // return the first match. 
      // there should only be one match for user query.
      return res.rows[0];
      // return res;
    } catch (err) {
      logger.error("Failed to get user details");
      throw err;
    }
  },

  async insertUser(userData: {username: string, password: string, first_name: string, middle_name: string, last_name: string, dob: string}, location: {address_l1: string, address_l2: string, address_l3: string, landmark: string, city: string, pincode: number}) {

    // insert location
    let location_insertion_response: QueryResult = await Locations.createLocation(location);
    if(!location_insertion_response) {
      logger.warn("Failed to insert location information.");
    }

    // insert user

    let user_insertion_query = `INSERT INTO Users(username, password, first_name, middle_name, last_name, dob, location_fk) 
              VALUES(
                ${userData.username},
                ${userData.password}, 
                ${userData.first_name}, 
                ${userData.middle_name}, 
                ${userData.last_name}, 
                ${userData.dob}, 
                ${location_insertion_response ? location_insertion_response.rows[0].location_id : 'NULL'}
            ) RETURNING *;`;

    try {
      let user_insertion_response: QueryResult = await db.query(user_insertion_query);
      if(!user_insertion_query) {
        logger.warn("User Insertion failed.");
        return null;
      }

      return user_insertion_response.rows[0];
    } catch(err) {
      logger.error("Failed to insert into User. ");
      logger.debug(err);

      return null;
    }
        

  },

  
  async insertUserWithLocation(location_id: number, userData: any) {
    let user_insertion_query =  `INSERT INTO Users(username, password, first_name, middle_name, last_name, dob, location_fk) 
              VALUES(
                ${userData.username},
                ${userData.password}, 
                ${userData.first_name}, 
                ${userData.middle_name}, 
                ${userData.last_name}, 
                ${userData.dob}, 
                ${location_id}
              );`;
      
    try {
    let user_insertion_result: QueryResult = await db.query(user_insertion_query);
    if(!user_insertion_result) {
      logger.error("User insertion Failed");
      return null;
    }
    return user_insertion_result.rows[0];
    } catch(err) {
      logger.error("Failed to insert into Users");
      logger.debug(err);
      return null;
    }
      
  }

  // async insertUser(parameters: {location_id: number}) {}
};
