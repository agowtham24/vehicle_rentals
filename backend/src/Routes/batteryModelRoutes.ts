import { Router } from "express";
import { verifyToken } from "../Utils/Jwt";
import { BatteryModelValidator } from "../Validations/batteryModel";
import {
  createBatteryModel,
  getAllBatteryModels,
  updateBatteryModel,
} from "../Controllers/batteryModelController";

const batteryModelRouter = Router();

batteryModelRouter.post(
  "/",
  verifyToken,
  BatteryModelValidator.createBatteryModel,
  createBatteryModel
);
batteryModelRouter.get("/", verifyToken, getAllBatteryModels);
batteryModelRouter.patch("/:id", verifyToken, updateBatteryModel);

export default batteryModelRouter;
