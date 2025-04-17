import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";

const DB_COLLECTIONS = Config.DB_COLLECTIONS;
interface BatteryModelSchema extends Document {
  name: string;
  manufactureBy: string;
  image: string;
  capacity: string;
  voltage: string;
}

const batteryModelSchema = new Schema<BatteryModelSchema>(
  {
    name: { type: String, required: true, unique: true },
    manufactureBy: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: String, required: true },
    voltage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const batteryModel =
  mongoose.models[DB_COLLECTIONS.batteryModels] ||
  mongoose.model<BatteryModelSchema>(
    DB_COLLECTIONS.batteryModels,
    batteryModelSchema
  );
