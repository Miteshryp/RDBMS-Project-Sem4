import { Response } from "express"

export default {
   error(res: Response, msg: string, data: Object, code: number = 500) {
      return res.send({
         msg, code,
         data
      });
   },

   success(res: Response, msg: string, data: Object, code: number = 200) {
      return res.send({
         msg, code,
         data
      })
   },

   entryNotFound(res: Response, msg: string, data: Object = null) {
      return res.send({
         msg: "Entry not found: " + msg, code: 303,
         data
      });
   },

   invalidParameter(res: Response, msg: string, data: Object = null) {
      return res.send({
         msg:"Invalid parameter: " + msg, code: 305,
         data
      });
   }
}