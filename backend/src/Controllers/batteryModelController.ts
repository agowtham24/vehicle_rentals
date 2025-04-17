import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createBatteryModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.create(DB_COLLECTIONS.batteryModels, req.body);
    return res.status(201).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};

export async function getAllBatteryModels(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const data = await service.find(
      DB_COLLECTIONS.batteryModels,
      {},
      { name: 1, capacity: 1, voltage: 1, image: 1, manufactureBy: 1 }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateBatteryModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.updateOne(
      DB_COLLECTIONS.batteryModels,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};
