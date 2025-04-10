import { Router } from "express";
import {
  createVehicleModel,
  getAllVehicleModels,
  updateVehicleModel,
} from "../Controllers/vehicleModelController";

const vehicleModelRouter = Router();

vehicleModelRouter.post("/", createVehicleModel);
vehicleModelRouter.get("/", getAllVehicleModels);
vehicleModelRouter.patch("/:id", updateVehicleModel);

export default vehicleModelRouter;
