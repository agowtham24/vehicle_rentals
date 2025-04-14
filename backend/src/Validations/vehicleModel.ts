import { NextFunction, Request } from "express";
import Joi from "joi";

export class VehicleModelValidator {
  static async createVehicleModel(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        manufactureBy: Joi.string().min(3).max(25).required(),
        batterySlots: Joi.number().valid(1, 2).required(),
        isSwapable: Joi.boolean().optional(),
        image: Joi.string().uri().required(),
        // role: Joi.string()
        //   .regex(/^[0-9a-fA-F]{24}$/)
        //   .message("Role must be a valid MongoDB ObjectId")
        //   .required(),
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
