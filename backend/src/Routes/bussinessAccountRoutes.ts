import { Router } from "express";
import {
  createBussinessAccount,
  getAllBussinessAccounts,
  updateBussinessAccount,
  loginBussiness,
} from "../Controllers/bussinessAccountController";
import { verifyToken } from "../Utils/Jwt";
import { BussinessAccountValidator } from "../Validations/bussinessAccount";
const bussinessAccountRouter = Router();

bussinessAccountRouter.post(
  "/",
  verifyToken,
  BussinessAccountValidator.createBussinessAccount,
  createBussinessAccount
);
bussinessAccountRouter.get("/", verifyToken, getAllBussinessAccounts);
bussinessAccountRouter.patch("/:id", verifyToken, updateBussinessAccount);
bussinessAccountRouter.post("/login", loginBussiness);
export default bussinessAccountRouter;
