import logger from "node-color-log";
import { QueryResult } from "pg";
import format from "pg-format";
import db from "../index";

const server = require("../../../utils/serverResponse");

// User Schema
/*
   First_name
   Last_name
   username Primary Key
   Address
   Date of Birth
*/

interface UserDataSchema {
  first_name: string,
  last_name: string,
  dob: string,

  
}

export default {
  // User data functions
  async getUserList() {
    let q = format(`SELECT * FROM ${process.env.USER_TABLE}`);
    
    try {
      let res = await db.query(q);
      if(!res) {
        logger.error("No response on list query");
        return null;
      }

      return res;
    } catch(err) {
      logger.error("Cannot fetch user list");
      return null;
    }
  },

  async getUser(parameters) {
    let q = parameters.user_id ? format(`SELECT * FROM ${process.env.USER_TABLE} WHERE (user_id=%s)`, parameters.user_id) : format(
      `SELECT * FROM ${process.env.USER_TABLE} WHERE (username=%s)`,
      parameters.username
    );

    try {
      let res: QueryResult = await db.query(q);

      if (!res) {
        logger.error(`Failed to fetch User info: ${parameters.username}`);
        return null;
      }

      return res.rows[0];
      return 
    } catch (err) {
      logger.error("Failed to get user details");
      throw err;
    }
  },

  async insertUser(parameters: {username, name, address_l1, city,  }) {

    // insert location


    // insert user
  },
};
