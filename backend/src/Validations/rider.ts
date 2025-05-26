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
  static async create(req: Request, res: any, next: NextFunction) {
    try {
      const schema = Joi.object({
        mobile: Joi.string()
          .pattern(/^\d{10,}$/)
          .required()
          .messages({
            "string.pattern.base": "Mobile number must be at least 10 digits",
            "string.empty": "Mobile number is required",
          }),

        name: Joi.string().min(2).required().messages({
          "string.min": "Name is required",
          "string.empty": "Name is required",
        }),

        dob: Joi.string().required().messages({
          "string.empty": "Date of birth is required",
        }),

        pan: Joi.string().length(10).required().messages({
          "string.length": "PAN must be 10 characters",
          "string.empty": "PAN is required",
        }),

        aadhar: Joi.string().length(12).pattern(/^\d+$/).required().messages({
          "string.length": "Aadhar must be 12 digits",
          "string.pattern.base": "Aadhar must be numeric",
          "string.empty": "Aadhar is required",
        }),

        drivingLicense: Joi.string().min(5).required().messages({
          "string.min": "Driving license is required",
          "string.empty": "Driving license is required",
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
