import logger from "node-color-log";
import { Request, Response } from "express";
// import ProductModel from "../models/Mongo/product";

export default {
  async getProduct(req: Request, res: Response) {
    const product = req.param("product");
    logger.debug(product);

    // let response = await ProductModel.findOne({name: product});
    // if(!response) {
    //    logger.warn("Error fetching product details");
    //    // TODO - Proper response structure to be created.
    //    return res.json({msg: "Failed to fetch details"});
    // }

    // logger.debug(response.price);

    // return res.json({
    //    msg: "Fetch successful",
    //    price: response.price
    // })
  },

  async createProduct(req: Request, res: Response) {
    logger.debug("POST Route");
    // let userData = req.userData;
    const productDetails = req.body;

    // let object = new ProductModel({
    //    name: productDetails.name,
    //    price: productDetails.price,
    //    type: productDetails.price
    // });

    // let response = await object.save();

    // if(!response) {
    //    logger.warn("Failed to create the product entry");
    //    // TODO - create a proper response format.
    //    return res.json();
    // }

    res.json({ msg: "Successfully create object" });
  },

  async placeOrder(req: Request, res: Response) {
  }
};
