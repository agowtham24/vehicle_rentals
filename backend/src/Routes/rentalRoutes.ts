import { Router } from "express";
import {
  createRental,
  getRentalsByBussiness,
  updateRental,
} from "../Controllers/rentalController";
import { RentalValidator } from "../Validations/rental";
import { verifyToken } from "../Utils/Jwt";

const rentalRouter = Router();

rentalRouter.post("/", verifyToken, RentalValidator.createRental, createRental);
rentalRouter.get("/", verifyToken, getRentalsByBussiness);
rentalRouter.patch("/:id", verifyToken, updateRental);

export default rentalRouter;
