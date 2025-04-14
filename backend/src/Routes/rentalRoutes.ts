import { Router } from "express";
import {
  createRental,
  getRentalsByBussiness,
  updateRental,
} from "../Controllers/rentalController";

const rentalRouter = Router();

rentalRouter.post("/", createRental);
rentalRouter.get("/", getRentalsByBussiness);
rentalRouter.patch("/:id", updateRental);

export default rentalRouter;
