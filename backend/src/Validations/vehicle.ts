import { NextFunction, Request } from "express";
import Joi from "joi";

export class VehicleValidator {
  static async createVehicle(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        assetId: Joi.string().min(3).max(25).required(),
        vehicleNumber: Joi.string().min(3).max(13).required(),
        vehicleModelId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .required(),
        registrationNo: Joi.string().required(),
        registeryName: Joi.string().required(),
        registrationDate: Joi.date().required(),
        device_imei: Joi.string()
          .pattern(/^\d{10,20}$/)
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

  static async getVehicles(req: Request, res: any, next: NextFunction) {
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

  static async getVehiclesByModel(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        id: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModel ID must be a valid MongoDB ObjectId")
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
