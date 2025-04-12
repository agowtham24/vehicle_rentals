import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";

const service = new MongooseService();

export const createVehicleModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.create("vehicleModels", req.body);
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
    const data = await service.find("vehicleModels");
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
      "vehicleModels",
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};
