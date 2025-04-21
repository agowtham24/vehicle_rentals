import { Router } from "express";
import {
  createVehicle,
  getVehiclesByStatus,
  updateVehicles,
  getVehiclesByModel,
} from "../Controllers/vehicleController";
import { VehicleValidator } from "../Validations/vehicle";
import { verifyToken } from "../Utils/Jwt";

const vehicleRouter = Router();

vehicleRouter.post(
  "/",
  verifyToken,
  VehicleValidator.createVehicle,
  createVehicle
);
vehicleRouter.get(
  "/modelId",
  verifyToken,
  VehicleValidator.getVehiclesByModel,
  getVehiclesByModel
);
vehicleRouter.get(
  "/",
  verifyToken,
  VehicleValidator.getVehicles,
  getVehiclesByStatus
);
vehicleRouter.patch("/:id", verifyToken, updateVehicles);

export default vehicleRouter;
