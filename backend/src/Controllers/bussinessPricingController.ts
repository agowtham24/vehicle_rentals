import { Request, NextFunction } from "express";
import { convertToObjectId, MongooseService } from "../mongoDB-setup";

const service = new MongooseService();

export const createBussinessPricing = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { vehicleModelId, bussinessId } = req.body;
    const isExisting = await service.findOne("bussinessPricings", {
      bussinessId,
      vehicleModelId,
    });
    if (isExisting)
      return res
        .status(400)
        .json({ status: true, message: "Bussiness already exists" });
    await service.create("bussinessPricings", req.body);
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

    const data = await service.aggregate("bussinessPricings", [
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
      "bussinessPricings",
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};
