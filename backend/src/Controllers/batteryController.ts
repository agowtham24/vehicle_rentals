import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createBattery = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.create(DB_COLLECTIONS.batteries, req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getAllBatteries(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { status } = req.query;
    const data = await service.aggregate(DB_COLLECTIONS.batteries, [
      {
        $match: {
          status,
        },
      },
      {
        $project: {
          assetId: 1,
          status: 1,
          name: 1,
          PurchaseDate: 1,
          manufactureBy: 1,
          manufacturingDate: 1,
        },
      },
    ]);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateBatteries = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.updateOne(
      DB_COLLECTIONS.batteries,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};
