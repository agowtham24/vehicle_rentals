import { Router } from "express";
import {
  createBussinessPricing,
  getByBussinessAndVehicleModel,
  updateBussinessPricing,
  deletePlan,
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
bussinessPricingRouter.patch(
  "/plan",
  verifyToken,
  PricingValidator.deletePlan,
  deletePlan
);
bussinessPricingRouter.patch("/:id", verifyToken, updateBussinessPricing);
export default bussinessPricingRouter;
