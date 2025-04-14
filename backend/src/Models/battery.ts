import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;
interface BatterySchema extends Document {
  name: string;
  assetId: string;
  manufactureBy: string;
  manufacturingDate: Date;
  PurchaseDate: Date;
  status: string;
  rentalId: mongoose.Schema.Types.ObjectId;
}

const batterySchema = new Schema<BatterySchema>(
  {
    name: { type: String, required: true },
    assetId: { type: String, required: true, unique: true },
    manufactureBy: { type: String, required: true },
    manufacturingDate: { type: Date },
    PurchaseDate: { type: Date },
    status: {
      type: String,
      enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"],
      default: "READY_TO_ASSIGN",
    },
    rentalId: { type: mongoose.Schema.Types.ObjectId, ref: "rentals" },
  },
  {
    timestamps: true,
  }
);

export const batteryModel =
  mongoose.models[DB_COLLECTIONS.batteries] ||
  mongoose.model<BatterySchema>(DB_COLLECTIONS.batteries, batterySchema);
