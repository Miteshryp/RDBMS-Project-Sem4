import dotenv from "dotenv"
dotenv.config();

// Module imports
import express from "express";
// import mongoose from "mongoose";
import logger from "node-color-log";
import {Pool, Client, QueryResult} from "pg";
import db from "./models/SQL";

const format = require("pg-format");


const app = express();
const serverPort: number = Number(process.env.PORT) | 8000;

// Routers
import productRouter from "./routers/product"; 
import userRouter from "./routers/user"



// const database_config = {
//    user: "postgres",
//    host: "localhost",
//    database: "localdb",
//    port: 5432,
//    password: "Micky@123"
// };
// const client = new Client(database_config);


// MongoDB Database Initialisation
// (
//    async () => {
//       let response = await mongoose.connect(process.env.DB_URI);
//       if(!response) {
//          logger.error("Failed to initialise database: ");
//          logger.debug(response);
//          return;
//       }

//       logger.info("Database connected");
//    }
// )();


// PostGreSQL Initialisation
(
   async () => {
      await db.initialiseTables();
      // let query = "SELECT * FROM Name";
      // let insertion_query = {
      //    text: "INSERT INTO Name VALUES($1, $2, $3, $4) RETURNING *;",
      //    values: [5, "Bewada", "Gujju", "Desai"]
      // }
      
      // let parameters = ["first_name"];
      // let insertion_parameters = [4, "Kathan", "Gujju", "Desai"];
      
      // client.query(q).then((results) => {
      //    console.log(results);
      //    console.log(results.rows[0]);
      // }).catch(err => console.log(err.stack));
   }
)();


// Express Setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Routers
app.use("/product", productRouter);
app.use("/user", )

app.listen(serverPort, () => {
   logger.info("Server running on port: ", serverPort);
});