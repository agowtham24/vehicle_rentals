import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";

const service = new MongooseService();

export const createRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.create("riders", req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getRiderByMobile(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const { mobile } = req.query;
    const regex = new RegExp(mobile as string, "i");
    const data = await service.find(
      "riders",
      { mobile: { $regex: regex } },
      { mobile: 1, status: 1 }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateRider = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    await service.updateOne("riders", { _id: req.params.id }, { ...req.body });
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};
