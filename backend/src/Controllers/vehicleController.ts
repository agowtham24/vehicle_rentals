import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";

const service = new MongooseService();

export const createVehicle = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.create("vehicles", req.body);
    return res.status(201).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};

export async function getAllVehicles(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const data = await service.aggregate("vehicles", [
        {
            $lookup: {
              from: "riders",
              localField: "riderId",
              foreignField: "_id",
              as: "rider",
            },
          },
          {
            $unwind: {
              path: "$rider",
              preserveNullAndEmptyArrays: true,
            },
          },
        
          {
            $lookup: {
              from: "rentals",
              localField: "rentalId",
              foreignField: "_id",
              as: "rental",
            },
          },
          {
            $unwind: {
              path: "$rental",
              preserveNullAndEmptyArrays: true,
            },
          },
          
          {
            $lookup: {
              from: "vehiclemodels", 
              localField: "vehicleModelId",
              foreignField: "_id",
              as: "vehicleModel",
            },
          },
          {
            $unwind: {
              path: "$vehicleModel",
              preserveNullAndEmptyArrays: true,
            },
          },
          // Lookup batteries
          {
            $lookup: {
              from: "batteries",
              localField: "assosiatedBatteries",
              foreignField: "_id",
              as: "batteries",
            },
          },
        
          {
            $project: {
              vehicleUid: 1,
              vehicleNumber: 1,
              status: 1,
              plan: 1,
              image: 1,
              registrationNo: 1,
              registeryName: 1,
              registrationDate: 1,
              rider: 1,
              rental: 1,
              vehicleModel: 1,
              batteries: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
    ]);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateVehicles = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const data = await service.updateOne(
      "vehicles",
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
};
