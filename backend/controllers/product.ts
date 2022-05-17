import logger from "node-color-log";
import { Request, Response } from "express";
import serverResponse from "../utils/serverResponse";
import Products from "../models/SQL/View/Products";
// import ProductModel from "../models/Mongo/product";

export default {
  async getProductList(req: Request, res: Response) {
    // const product = req.param("product");

    let product = req.query.product;
    let category = req.query.category;

    if(!product && !category) {
      logger.error("Invalid get request: product or category are undefined.");
      return serverResponse.invalidParameter(res, "Invalid product or category field", {complete: false});
    }

    let productList = await (product
                            ? Products.getProductListByName(product)
                            : Products.getProductListByCategory(category)
                            );
    if(!productList) {
      return serverResponse.success(res, "Empty Product response", {complete: true});
    }
    

    logger.debug(product);

    return serverResponse.success(res, "Product list fetched.", {complete: true, payload: productList});
    return res.send({msg: "ok", product});

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
    let {productData} = req.body;

    // @TODO: Security path - pre process the user input

    // @TODO: Security patch
    let insertionResponse = await Products.createProduct(productData);
    if(!insertionResponse) {
      return serverResponse.error(res, "Could not create product", {complete: false});
    }

    return serverResponse.success(res, "Product created successfully", {complete: true, payload: insertionResponse});

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

};
