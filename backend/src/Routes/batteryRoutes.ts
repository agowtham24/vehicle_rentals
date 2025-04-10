import { Router } from "express";
import {
  createBattery,
  getAllBatteries,
  updateBatteries,
} from "../Controllers/batteryController";

const batteryRouter = Router();

batteryRouter.post("/", createBattery);
batteryRouter.get("/", getAllBatteries);
batteryRouter.patch("/:id", updateBatteries);

export default batteryRouter;
