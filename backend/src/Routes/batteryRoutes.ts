import { Router } from "express";
import {
  createBattery,
  getAllBatteries,
  updateBatteries,
} from "../Controllers/batteryController";
import { verifyToken } from "../Utils/Jwt";
import { BatteryValidator } from "../Validations/battery";

const batteryRouter = Router();

batteryRouter.post(
  "/",
  verifyToken,
  BatteryValidator.createBattery,
  createBattery
);
batteryRouter.get(
  "/",
  verifyToken,
  BatteryValidator.getBatteries,
  getAllBatteries
);
batteryRouter.patch("/:id", verifyToken, updateBatteries);

export default batteryRouter;
