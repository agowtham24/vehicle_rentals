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
      return res.status(400).json({
        status: true,
        message: "Pricings already exists Please update.",
      });
    await service.create(DB_COLLECTIONS.bussinessPricings, req.body);
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
    const { bussinessId } = req.query;
    const data = await service.aggregate(DB_COLLECTIONS.bussinessPricings, [
      {
        $match: {
          bussinessId: await convertToObjectId(bussinessId as string),
        },
      },
      {
        $lookup: {
          from: DB_COLLECTIONS.vehicleModels,
          localField: "vehicleModelId",
          foreignField: "_id",
          as: "vehicleModel",
          pipeline: [
            {
              $project: {
                _id: 0,
                image: 1,
                name: 1,
                topSpeed: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$vehicleModel" },
      {
        $project: {
          plans: 1,
          vehicleModel: 1,
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

export const addPlan = async (req: Request, res: any, next: NextFunction) => {
  try {
    const { bpId } = req.query;
    await service.updateOne(
      DB_COLLECTIONS.bussinessPricings,
      { _id: bpId },
      { $push: { plans: req.body } }
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
