import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";

const service = new MongooseService();

export const createBattery = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.create("batteries", req.body);
    return res.status(201).json({ status: true, message: "success", data });
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
    const data = await service.aggregate("batteries", [
      {
        $project: {
          name: 1,
          manufactureBy: 1,
          status:1
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
    const data = await service.updateOne(
      "batteries",
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};
