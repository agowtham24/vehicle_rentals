import { Request, NextFunction } from "express";
import { convertToObjectId, MongooseService } from "../mongoDB-setup";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();
type Filter = {
  bussinessId: string;
  status?: number;
};
export const createRental = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const plan = req.body.plan; // { type: 'day', value: 3 }
    const currentDate = new Date(); // current date-time

    let endRentalDate: Date;

    if (plan.type === "day") {
      endRentalDate = new Date(
        currentDate.getTime() + plan.value * 24 * 60 * 60 * 1000
      );
    } else if (plan.type === "week") {
      endRentalDate = new Date(
        currentDate.getTime() + plan.value * 7 * 24 * 60 * 60 * 1000
      );
    } else {
      throw new Error("Invalid plan type");
    }
    req.body.rentalEndDate = endRentalDate;

    const rental = await service.create(DB_COLLECTIONS.rentals, req.body);
    await service.updateOne(
      DB_COLLECTIONS.vehicles,
      {
        _id: await convertToObjectId(req.body.vehicleId),
      },
      {
        status: "ASSIGNED",
        assosiatedBatteries: req.body.assosiatedBatteries,
        rentalId: rental._id,
      }
    );
    const objectIds = await Promise.all(
      req.body.assosiatedBatteries.map(
        async (id: string) => await convertToObjectId(id)
      )
    );

    await service.updateMany(
      DB_COLLECTIONS.batteries,
      {
        _id: { $in: objectIds },
      },
      {
        status: "ASSIGNED",
        rentalId: rental._id,
      }
    );
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getRentalsByBussiness(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { bussinessId, status } = req.query;

    const data = await service.aggregate(DB_COLLECTIONS.rentals, [
      {
        $match: {
          bussinessId: await convertToObjectId(bussinessId as string),
          status: Number(status),
        },
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
                mobile: 1,
                name: 1,
                _id: 1,
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
          from: DB_COLLECTIONS.vehicles,
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
          pipeline: [
            {
              $project: {
                assetId: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$vehicle",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          plan: 1,
          rentalEndDate: 1,
          rider: 1,
          vehicle: 1,
          status: 1,
        },
      },
    ]);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateRental = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.updateOne(
      DB_COLLECTIONS.rentals,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export const deAssignVehicleToBussiness = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { batteries, vehicleId, rentalId } = req.body;
    const isRiderAssigned = await service.findOne(DB_COLLECTIONS.rentals, {
      _id: await convertToObjectId(rentalId as string),
      riderId: { $exists: true },
    });
    if (isRiderAssigned)
      return res.status(400).json({ message: "Rider already assigned." });
    const objectBatteryIds = await Promise.all(
      batteries.map((id: string) => convertToObjectId(id))
    );

    await service.updateOne(
      DB_COLLECTIONS.vehicles,
      { _id: await convertToObjectId(vehicleId) },
      {
        $set: { status: "READY_TO_ASSIGN" },
        $unset: {
          rentalId: "",
          assosiatedBatteries: "",
        },
      }
    );

    await service.updateMany(
      DB_COLLECTIONS.batteries,
      { _id: { $in: objectBatteryIds } },
      {
        $set: { status: "READY_TO_ASSIGN" },
        $unset: {
          rentalId: "",
        },
      }
    );

    await service.deleteOne(DB_COLLECTIONS.rentals, {
      _id: await convertToObjectId(rentalId as string),
    });

    return res.status(200).json({ message: "success", status: true });
  } catch (error) {
    next(error);
  }
};

export const assignRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { riderId, rentalId } = req.body;
    const rental: any = await service.updateOne(
      DB_COLLECTIONS.rentals,
      { _id: rentalId },
      {
        riderId,
        status: 1,
      }
    );

    await service.updateOne(
      DB_COLLECTIONS.riders,
      { _id: riderId },
      {
        isActiveRide: true,
        status: "ASSIGNED",
        rentalId,
        vehicleId: rental.vehicleId,
        bussinessId: rental.bussinessId,
      }
    );
    return res.status(200).json({ message: "success", status: true });
  } catch (error) {
    next(error);
  }
};

export const deAssignRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { riderId, rentalId } = req.body;

    // 1. Remove riderId from rental
    await service.updateOne(
      DB_COLLECTIONS.rentals,
      { _id: rentalId },
      { $unset: { riderId: "" }, status: 0 }
    );

    // 2. Reset rider data
    await service.updateOne(
      DB_COLLECTIONS.riders,
      { _id: riderId },
      {
        $set: {
          isActiveRide: false,
          status: "ACTIVE",
        },
        $unset: {
          rentalId: "",
          vehicleId: "",
          bussinessId: "",
        },
      }
    );

    return res.status(200).json({ message: "Rider de-assigned", status: true });
  } catch (error) {
    next(error);
  }
};
