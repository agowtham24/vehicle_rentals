import { NextFunction, Request } from "express";
import Joi from "joi";

export class RentalValidator {
  static async createRental(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        bussinessId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .required(),
        vehicleId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleId must be a valid MongoDB ObjectId")
          .required(),
        plan: Joi.object({
          type: Joi.string().valid("day", "week").required(),
          amount: Joi.number().min(0).required(),
          value: Joi.number().min(1).required(),
        }),
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
