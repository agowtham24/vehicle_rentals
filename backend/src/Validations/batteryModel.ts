import { NextFunction, Request } from "express";
import Joi from "joi";

export class BatteryModelValidator {
  static async createBatteryModel(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        manufactureBy: Joi.string().min(3).max(25).required(),
        image: Joi.string().uri().required(),
        capacity: Joi.string().required(),
        voltage: Joi.string().required(),
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
