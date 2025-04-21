import { Router } from "express";
import {
  createBussinessPricing,
  getByBussinessAndVehicleModel,
  updateBussinessPricing,
  deletePlan,
  addPlan,
  getVehicleModelsByTenant,
} from "../Controllers/bussinessPricingController";
import { PricingValidator } from "../Validations/bussinessPricing";
import { verifyToken } from "../Utils/Jwt";

const bussinessPricingRouter = Router();

bussinessPricingRouter.post(
  "/plan",
  verifyToken,
  PricingValidator.addPlan,
  addPlan
);
bussinessPricingRouter.post(
  "/",
  verifyToken,
  PricingValidator.createPricing,
  createBussinessPricing
);
bussinessPricingRouter.get(
  "/vehicleModels",
  verifyToken,
  PricingValidator.getVehicleModelsByTenant,
  getVehicleModelsByTenant
);
bussinessPricingRouter.get(
  "/",
  verifyToken,
  PricingValidator.getPricings,
  getByBussinessAndVehicleModel
);
bussinessPricingRouter.delete(
  "/plan",
  verifyToken,
  PricingValidator.deletePlan,
  deletePlan
);
bussinessPricingRouter.patch("/:id", verifyToken, updateBussinessPricing);
export default bussinessPricingRouter;
