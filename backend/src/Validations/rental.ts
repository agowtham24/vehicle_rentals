import { NextFunction, Request } from "express";
import Joi from "joi";
const planValidator = Joi.object({
  type: Joi.string().valid("day", "week").required(),
  amount: Joi.number().min(0).required(),
  value: Joi.number().min(1).required(),
  sdAmount: Joi.number().min(0).required(),
  batteries: Joi.number().min(1).max(2).required(),
  swapCharge: Joi.number().min(0).optional(),
  freeSwaps: Joi.number().min(0).optional(),
  _id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("planId must be a valid MongoDB ObjectId")
    .required(),
});
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
        plan: planValidator,
        assosiatedBatteries: Joi.array()
          .items(
            Joi.string()
              .regex(/^[0-9a-fA-F]{24}$/)
              .message("Each Battery must be a valid MongoDB ObjectId")
          )
          .min(1)
          .max(2)
          .required(),
        vehicleModelId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .optional(),
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

  static async deAssignVehicle(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        rentalId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("rentalId must be a valid MongoDB ObjectId")
          .required(),
        vehicleId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleId must be a valid MongoDB ObjectId")
          .required(),
        batteries: Joi.array()
          .items(
            Joi.string()
              .regex(/^[0-9a-fA-F]{24}$/)
              .message("Each Battery must be a valid MongoDB ObjectId")
          )
          .min(1)
          .max(2)
          .required(),
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
