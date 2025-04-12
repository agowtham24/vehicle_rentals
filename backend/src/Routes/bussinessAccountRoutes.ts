import { Router } from "express";
import {
  createBussinessAccount,
  getAllBussinessAccounts,
  updateBussinessAccount,
  loginBussiness,
} from "../Controllers/bussinessAccountController";
import { verifyToken } from "../Utils/Jwt";
const bussinessAccountRouter = Router();

bussinessAccountRouter.post("/", createBussinessAccount);
bussinessAccountRouter.get("/", verifyToken, getAllBussinessAccounts);
bussinessAccountRouter.patch("/:id", updateBussinessAccount);
bussinessAccountRouter.post("/login", loginBussiness);

export default bussinessAccountRouter;
