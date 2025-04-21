import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.create(DB_COLLECTIONS.riders, req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getRiderByMobile(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { mobile } = req.query;
    
    const regex = new RegExp(mobile as string, "i");
    const data = await service.find(
      DB_COLLECTIONS.riders,
      { mobile: { $regex: regex }, status: "ACTIVE" },
      { mobile: 1, status: 1 }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.updateOne(
      DB_COLLECTIONS.riders,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};
