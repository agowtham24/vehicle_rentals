import { NextFunction, Request } from "express";
import Joi from "joi";

export class BatteryValidator {
  static async createBattery(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        assetId: Joi.string().min(3).max(10).required(),
        manufactureBy: Joi.string().required(),
        manufacturingDate: Joi.date().optional(),
        PurchaseDate: Joi.date().optional(),
        batteryModelId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("batteryModelId must be a valid MongoDB ObjectId")
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

  static async getBatteries(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        status: Joi.string()
          .valid("READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE")
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
