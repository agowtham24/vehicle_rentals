import { Router } from "express";
import {
  createBussinessPricing,
  getByBussinessAndVehicleModel,
  updateBussinessPricing,
} from "../Controllers/bussinessPricingController";
import { PricingValidator } from "../Validations/bussinessPricing";
import { verifyToken } from "../Utils/Jwt";

const bussinessPricingRouter = Router();

bussinessPricingRouter.post(
  "/",
  verifyToken,
  PricingValidator.createPricing,
  createBussinessPricing
);
bussinessPricingRouter.get(
  "/",
  verifyToken,
  PricingValidator.getPricings,
  getByBussinessAndVehicleModel
);
bussinessPricingRouter.patch("/:id", verifyToken, updateBussinessPricing);

export default bussinessPricingRouter;
