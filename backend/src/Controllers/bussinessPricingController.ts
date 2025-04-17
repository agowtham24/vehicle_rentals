import { Request, NextFunction } from "express";
import { convertToObjectId, MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createBussinessPricing = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { vehicleModelId, bussinessId } = req.body;
    const isExisting = await service.findOne(DB_COLLECTIONS.bussinessPricings, {
      bussinessId,
      vehicleModelId,
    });
    if (isExisting)
      return res
        .status(400)
        .json({ status: true, message: "Bussiness already exists" });
    await service.create("bussinessPricings", req.body);
    await service.updateOne(
      DB_COLLECTIONS.bussinessAccounts,
      { _id: req.body.bussinessId },
      { isPricing: true }
    );
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getByBussinessAndVehicleModel(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { bussinessId, vehicleModelId } = req.query;

    const data = await service.aggregate(DB_COLLECTIONS.bussinessPricings, [
      {
        $match: {
          bussinessId: await convertToObjectId(bussinessId as string),
          vehicleModelId: await convertToObjectId(vehicleModelId as string),
        },
      },
      {
        $project: {
          plans: 1,
        },
      },
    ]);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateBussinessPricing = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.updateOne(
      DB_COLLECTIONS.bussinessPricings,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { planId, bpId } = req.query;
    await service.updateOne(
      DB_COLLECTIONS.bussinessPricings,
      { _id: bpId },
      {
        $pull: {
          plans: { _id: await convertToObjectId(planId as string) },
        },
      }
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
