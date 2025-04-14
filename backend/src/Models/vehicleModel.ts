import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;
interface VehicleModelSchema extends Document {
  name: string;
  manufactureBy: string;
  batterySlots: number;
  isSwapable: boolean;
  image: string;
}

const vehicleModelSchema = new Schema<VehicleModelSchema>(
  {
    name: { type: String, required: true, unique: true },
    manufactureBy: { type: String, required: true },
    batterySlots: { type: Number, default: 1 },
    isSwapable: { type: Boolean, default: false },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const vehicleModel =
  mongoose.models[DB_COLLECTIONS.vehicleModels] ||
  mongoose.model<VehicleModelSchema>(
    DB_COLLECTIONS.vehicleModels,
    vehicleModelSchema
  );
