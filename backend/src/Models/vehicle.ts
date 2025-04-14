import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

interface VehicleSchema extends Document {
  assetId: string;
  vehicleNumber: string;
  assosiatedBatteries?: [mongoose.Schema.Types.ObjectId];
  status: string; //enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"]
  riderId?: mongoose.Schema.Types.ObjectId;
  rentalId?: mongoose.Schema.Types.ObjectId;
  vehicleModelId: mongoose.Schema.Types.ObjectId;
  registrationNo: string;
  registeryName: string;
  registrationDate: Date;
  device_imei: string;
}

const vehicleSchema = new Schema<VehicleSchema>(
  {
    assetId: { type: String, required: true, unique: true },
    vehicleNumber: { type: String, required: true },
    assosiatedBatteries: [
      { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.batteries },
    ],
    status: {
      type: String,
      enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"],
      default: "READY_TO_ASSIGN",
    },
    riderId: { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.riders },
    rentalId: { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.rentals },
    vehicleModelId: {
      type: Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.vehicleModels,
    },
    registrationNo: { type: String, required: true },
    registeryName: { type: String, required: true },
    registrationDate: { type: Date, required: true },
    device_imei: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const vehicleModel =
  mongoose.models[DB_COLLECTIONS.vehicles] ||
  mongoose.model<VehicleSchema>(DB_COLLECTIONS.vehicles, vehicleSchema);
