import { NextFunction, Request } from "express";
import Joi from "joi";

export class BussinessAccountValidator {
  static async createBussinessAccount(
    req: Request,
    res: any,
    next: NextFunction
  ) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string()
          .pattern(/^[6-9]\d{9}$/)
          .message("Mobile must be a valid 10-digit number")
          .required(),
        password: Joi.string().min(6).required(),
      
        address: Joi.string().required(),
        pincode: Joi.string().required(),
        state: Joi.string().required(),
      
        image: Joi.string().uri().required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error)
        return res
          .status(400)
          .json(error.details.map((detail) => detail.message));
      next();
    } catch (error) {
      next(error);
    }
  }
}
