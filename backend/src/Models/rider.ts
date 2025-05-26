import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;
interface RiderSchema extends Document {
  mobile: string;
  name: string;
  status: string;
  isActiveRide: boolean;
  isSdPaid: boolean;
  isRentPaid: boolean;
  sdAmount: number;
  vehicleId: mongoose.Schema.Types.ObjectId;
  rentalId: mongoose.Schema.Types.ObjectId;
  bussinessId: mongoose.Schema.Types.ObjectId;
  dob: Date;
  pan: string;
  aadhar: string;
  drivingLicense: string;
}

const riderSchema = new Schema<RiderSchema>(
  {
    dob: {
      type: Date,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    aadhar: {
      type: String,
      required: true,
    },
    drivingLicense: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ASSIGNED", "BLACK_LISTED"],
      default: "ACTIVE",
    },
    isActiveRide: { type: Boolean, default: false },
    isSdPaid: { type: Boolean },
    isRentPaid: { type: Boolean },
    sdAmount: { type: Number },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.vehicles,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.rentals,
    },
    bussinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.bussinessAccounts,
    },
  },
  {
    timestamps: true,
  }
);

export const riderModel =
  mongoose.models[DB_COLLECTIONS.riders] ||
  mongoose.model<RiderSchema>(DB_COLLECTIONS.riders, riderSchema);
