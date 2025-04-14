import { Router } from "express";
import {
  createVehicleModel,
  getAllVehicleModels,
  updateVehicleModel,
} from "../Controllers/vehicleModelController";
import { VehicleModelValidator } from "../Validations/vehicleModel";
import { verifyToken } from "../Utils/Jwt";
const vehicleModelRouter = Router();

vehicleModelRouter.post(
  "/",
  verifyToken,
  VehicleModelValidator.createVehicleModel,
  createVehicleModel
);
vehicleModelRouter.get("/", verifyToken, getAllVehicleModels);
vehicleModelRouter.patch("/:id", verifyToken, updateVehicleModel);

export default vehicleModelRouter;
