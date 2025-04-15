import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import { Bcrypt } from "../Utils/Bcrypt";
import { generateToken } from "../Utils/Jwt";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

const service = new MongooseService();

export const createBussinessAccount = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    req.body.password = await Bcrypt.hashPassword(req.body.password);
    req.body.role = "TENANT";
    await service.create(DB_COLLECTIONS.bussinessAccounts, req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    req.body.password = await Bcrypt.hashPassword(req.body.password);
    req.body.role = "ADMIN";
    await service.create(DB_COLLECTIONS.bussinessAccounts, req.body);
    return res.status(201).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export async function getAllBussinessAccounts(
  req: Request,
  res: any,
  next: NextFunction
) {
  try {
    const data = await service.find(
      DB_COLLECTIONS.bussinessAccounts,
      {},
      { password: 0 }
    );
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    next(error);
  }
}

export const updateBussinessAccount = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    if (req.body.password)
      req.body.password = await Bcrypt.hashPassword(req.body.password);
    await service.updateOne(
      DB_COLLECTIONS.bussinessAccounts,
      { _id: req.params.id },
      { ...req.body }
    );
    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    next(error);
  }
};

export const loginBussiness = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const isExistingAccount: any = await service.findOne(
      DB_COLLECTIONS.bussinessAccounts,
      { email },
      { password: 1, email: 1, loginCount: 1 }
    );
    if (!isExistingAccount)
      return res.status(404).json({ message: "No user found on that email" });
    const isPasswordMatched = await Bcrypt.comparePassword(
      password,
      isExistingAccount.password
    );

    if (!isPasswordMatched)
      return res.status(404).json({ message: "Password mismatched" });
    const loginCount = isExistingAccount.loginCount + 1;
    await service.updateOne(
      DB_COLLECTIONS.bussinessAccounts,
      { email },
      {
        loginCount,
      }
    );
    const token = await generateToken({
      email: isExistingAccount.email,
      _id: isExistingAccount._id,
      loginCount,
    });
    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    next(error);
  }
};
