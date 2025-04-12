import { Request, NextFunction } from "express";
import { MongooseService } from "../mongoDB-setup";
import { Bcrypt } from "../Utils/Bcrypt";
import { generateToken } from "../Utils/Jwt";

const service = new MongooseService();

export const createBussinessAccount = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    req.body.password = await Bcrypt.hashPassword(req.body.password);
    await service.create("bussinessAccounts", req.body);
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
    const data = await service.find("bussinessAccounts",{},{password:0});
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
      "bussinessAccounts",
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
      "bussinessAccounts",
      { email },
      { password: 1, email: 1 }
    );
    if (!isExistingAccount)
      return res.status(404).json({ message: "No user found on that email" });
    const isPasswordMatched = await Bcrypt.comparePassword(
      password,
      isExistingAccount.password
    );

    if (!isPasswordMatched)
      return res.status(404).json({ message: "Password mismatched" });

    const token = await generateToken({
      email: isExistingAccount.email,
      _id: isExistingAccount._id,
    });
    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    next(error);
  }
};
