import { Router } from "express";
import { createVehicleModel } from "../Controllers/vehicleModelController";

const vehicleModelRouter = Router();

vehicleModelRouter.post("/",createVehicleModel)

export default vehicleModelRouter;
