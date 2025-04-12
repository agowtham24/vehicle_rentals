import { Router } from "express";
import {
  createVehicle,
  getVehiclesByStatus,
  updateVehicles,
} from "../Controllers/vehicleController";

const vehicleRouter = Router();

vehicleRouter.post("/", createVehicle);
vehicleRouter.get("/", getVehiclesByStatus);
vehicleRouter.patch("/:id", updateVehicles);

export default vehicleRouter;
