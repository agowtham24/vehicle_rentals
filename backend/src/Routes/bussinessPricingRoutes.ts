import { Router } from "express";
import {
  createBussinessPricing,
  getByBussinessAndVehicleModel,
  updateBussinessPricing,
} from "../Controllers/bussinessPricingController";

const bussinessPricingRouter = Router();

bussinessPricingRouter.post("/", createBussinessPricing);
bussinessPricingRouter.get("/", getByBussinessAndVehicleModel);
bussinessPricingRouter.patch("/:id", updateBussinessPricing);

export default bussinessPricingRouter;
