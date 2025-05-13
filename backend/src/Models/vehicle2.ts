import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

interface VehicleSchema extends Document {
  assetId: string;
  vehicleNumber: string;
  batteryId1: string;
  batteryId2: string;
  chargerId: string;
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
    vehicleNumber: { type: String },
    batteryId1: { type: String },
    batteryId2: { type: String },
    chargerId: { type: String },
    status: {
      type: String,
      enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"],
      default: "READY_TO_ASSIGN",
    },
    riderId: { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.riders },
    rentalId: { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.rentals },
    vehicleModelId: {
      type: String,
    },
    registrationNo: { type: String },
    registeryName: { type: String },
    registrationDate: { type: Date },
    device_imei: { type: String },
  },
  {
    timestamps: true,
  }
);

export const vehicleModel2 =
  mongoose.models[DB_COLLECTIONS.vehicles2] ||
  mongoose.model<VehicleSchema>(DB_COLLECTIONS.vehicles2, vehicleSchema);
