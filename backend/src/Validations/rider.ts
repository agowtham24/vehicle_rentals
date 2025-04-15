import { NextFunction, Request } from "express";
import Joi from "joi";

export class RiderValidator {
  static async getRiderByMobile(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        mobile: Joi.string()
          .pattern(/^[6-9]\d{9}$/)
          .message("Mobile must be a valid 10-digit number")
          .required(),
      });
      const { error } = schema.validate(req.query, { abortEarly: false });
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
