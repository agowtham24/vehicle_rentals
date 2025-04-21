import { Router } from "express";
import {
  createRental,
  getRentalsByBussiness,
  updateRental,
  deAssignVehicleToBussiness,
  assignRider,
  deAssignRider,
} from "../Controllers/rentalController";
import { RentalValidator } from "../Validations/rental";
import { verifyToken } from "../Utils/Jwt";

const rentalRouter = Router();
rentalRouter.post("/assignRider", verifyToken, assignRider),
  rentalRouter.post("/deAssignRider", verifyToken, deAssignRider);
rentalRouter.post(
  "/deAssign",
  RentalValidator.deAssignVehicle,
  verifyToken,
  deAssignVehicleToBussiness
);
rentalRouter.post("/", verifyToken, RentalValidator.createRental, createRental);
rentalRouter.get("/", verifyToken, getRentalsByBussiness);
rentalRouter.patch("/:id", verifyToken, updateRental);

export default rentalRouter;
