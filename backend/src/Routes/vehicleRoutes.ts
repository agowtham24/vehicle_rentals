import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  updateVehicles,
} from "../Controllers/vehicleController";

const vehicleRouter = Router();

vehicleRouter.post("/", createVehicle);
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.patch("/:id", updateVehicles);

export default vehicleRouter;
