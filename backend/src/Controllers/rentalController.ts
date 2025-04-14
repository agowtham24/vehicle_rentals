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
    await service.updateMany(
      DB_COLLECTIONS.batteries,
      {
        _id: {
          $in: req.body.assosiatedBatteries.map((id: string) =>
            convertToObjectId(id)
          ),
        },
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
    let filter: Filter = {
      bussinessId: bussinessId as string,
    };
    if (status) filter.status = +status;
    const data = await service.find(DB_COLLECTIONS.rentals, filter);
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
