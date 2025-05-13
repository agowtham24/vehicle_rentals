import { Request, Router } from "express";
import {
  createRental,
  getRentalsByBussiness,
  updateRental,
  deAssignVehicleToBussiness,
  assignRider,
  deAssignRider,
  bulkAssign,
} from "../Controllers/rentalController";
import { RentalValidator } from "../Validations/rental";
import { verifyToken } from "../Utils/Jwt";
import multer, { FileFilterCallback } from "multer";

// Multer Configuration (Memory Storage)
const storage = multer.memoryStorage();

// Allowed MIME Types
const allowedMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

// File Filter - Only allow Excel files
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error("Only Excel files (.xlsx, .xls) are allowed"));
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

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
rentalRouter.post("/bulk", upload.single("file"), bulkAssign);
export default rentalRouter;
