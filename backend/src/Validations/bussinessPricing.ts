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
});

export class PricingValidator {
  static async createPricing(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        bussinessId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .required(),
        vehicleModelId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .required(),
        plans: Joi.array().items(planValidator).min(1).required(),
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

  static async getPricings(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        vehicleModelId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
          .required(),
        bussinessId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("vehicleModelId must be a valid MongoDB ObjectId")
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

  static async deletePlan(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        planId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("PlanId must be a valid MongoDB ObjectId")
          .required(),
        bpId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("bussiness Pricing must be valid MongoDB ObjectId")
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
