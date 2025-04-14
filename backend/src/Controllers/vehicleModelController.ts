import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createVehicleModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.create(DB_COLLECTIONS.vehicleModels, req.body);
    return res.status(201).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};

export async function getAllVehicleModels(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const data = await service.find(DB_COLLECTIONS.vehicleModels);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateVehicleModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.updateOne(
      DB_COLLECTIONS.vehicleModels,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};
