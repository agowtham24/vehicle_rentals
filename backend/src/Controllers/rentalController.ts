import { Request, NextFunction } from "express";
import { convertToObjectId, MongooseService } from "../mongoDB-setup";
import Config from "../config";
import xlsx from "xlsx";
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
          from: DB_COLLECTIONS.vehicles2,
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
          pipeline: [
            {
              $project: {
                assetId: 1,
                batteryId1: 1,
                batteryId2: 1,
                chargerId: 1,
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
          // plan: 1,
          // rentalEndDate: 1,
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
    const {  vehicleId, rentalId } = req.body;
    const isRiderAssigned = await service.findOne(DB_COLLECTIONS.rentals, {
      _id: await convertToObjectId(rentalId as string),
      riderId: { $exists: true },
    });
    if (isRiderAssigned)
      return res.status(400).json({ message: "Rider already assigned." });
    // const objectBatteryIds = await Promise.all(
    //   batteries.map((id: string) => convertToObjectId(id))
    // );

    await service.updateOne(
      DB_COLLECTIONS.vehicles2,
      { _id: await convertToObjectId(vehicleId) },
      {
        $set: { status: "READY_TO_ASSIGN" },
        $unset: {
          rentalId: "",
          // assosiatedBatteries: "",
        },
      }
    );

    // await service.updateMany(
    //   DB_COLLECTIONS.batteries,
    //   { _id: { $in: objectBatteryIds } },
    //   {
    //     $set: { status: "READY_TO_ASSIGN" },
    //     $unset: {
    //       rentalId: "",
    //     },
    //   }
    // );

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

export const bulkAssign = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { bussinessId } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type" });
    }

    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData: any[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    if (!sheetData.length) {
      return res.status(400).json({ message: "Empty Excel file" });
    }

    const assets: any[] = [];
    const alreadyAssigned: any[] = [];
    const vehicleIds = sheetData.map((data) => data.vehicleId);

    // Fetch all existing vehicles in a single query
    const existingVehicles = await service.find(DB_COLLECTIONS.vehicles2, {
      assetId: { $in: vehicleIds },
    });

    const existingVehicleMap = new Map<string, any>(
      existingVehicles.map((vehicle: any) => [vehicle.assetId, vehicle])
    );

    for (const data of sheetData) {
      const existingVehicle = existingVehicleMap.get(data.vehicleId);

      if (existingVehicle) {
        if (existingVehicle.status === "ASSIGNED") {
          alreadyAssigned.push({ vehicleId: data.vehicleId });
          continue;
        }

        // Prepare rental asset
        assets.push({
          bussinessId,
          vehicleId: existingVehicle._id,
          vehicleModel:data.vehicleModel
        });
      } else {
        // Create new vehicle
        const newVehicle = await service.create(DB_COLLECTIONS.vehicles2, {
          assetId: data.vehicleId,
          batteryId1: data.batteryId1,
          batteryId2: data.batteryId2,
          chargerId: data.chargerId,
          status: "ASSIGNED",
        } as any);

        assets.push({
          bussinessId,
          vehicleId: newVehicle._id,
             vehicleModel:data.vehicleModel
        });
      }
    }

    let insertedAssets = [];
    if (assets.length) {
      // Insert rentals first
      insertedAssets = await service.insertMany(DB_COLLECTIONS.rentals, assets);

      // Update vehicle documents with rentalId
      const updatePromises = insertedAssets.map(async (asset:any) => {
        return service.updateOne(
          DB_COLLECTIONS.vehicles2,
          { _id: asset.vehicleId },
          { status: "ASSIGNED", rentalId: asset._id,vehicleModelId:asset.vehicleModel }
        );
      });
      await Promise.all(updatePromises);
    }

    return res.status(201).json({
      message: "Operation completed",
      assignedCount: insertedAssets.length,
      alreadyAssignedCount: alreadyAssigned.length,
      alreadyAssigned,
    });
  } catch (error) {
    next(error);
  }
};