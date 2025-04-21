import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createVehicle = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.create(DB_COLLECTIONS.vehicles, req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getVehiclesByStatus(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { status } = req.query;
    const data = await service.aggregate(DB_COLLECTIONS.vehicles, [
      {
        $match: { status },
      },
      {
        $lookup: {
          from: DB_COLLECTIONS.riders,
          localField: "riderId",
          foreignField: "_id",
          as: "rider",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                mobile: 1,
              },
            },
          ],
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
          from: DB_COLLECTIONS.vehicleModels,
          localField: "vehicleModelId",
          foreignField: "_id",
          as: "vehicleModel",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                image: 1,
              },
            },
          ],
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
          from: DB_COLLECTIONS.batteries,
          localField: "assosiatedBatteries",
          foreignField: "_id",
          as: "batteries",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: DB_COLLECTIONS.rentals,
          localField: "rentalId",
          foreignField: "_id",
          as: "rental",
          pipeline: [
            {
              $match: {
                status: 0,
              },
            },
            {
              $lookup: {
                from: DB_COLLECTIONS.bussinessAccounts,
                localField: "bussinessId",
                foreignField: "_id",
                as: "bussiness",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      _id: 0,
                      image: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$bussiness",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                bussiness: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$rental",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          assetId: 1,
          rider: 1,
          rental: 1,
          vehicleModel: 1,
          batteries: 1,
          status: 1,
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
    await service.updateOne(
      DB_COLLECTIONS.vehicles,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export const getVehiclesByModel = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { id } = req.query;
    const data = await service.find(
      DB_COLLECTIONS.vehicles,
      { vehicleModelId: id, status: "READY_TO_ASSIGN" },
      { assetId: 1, _id: 1 }
    );
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    next(error);
  }
};
