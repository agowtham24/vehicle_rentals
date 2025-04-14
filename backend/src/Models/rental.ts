import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

type Plan = {
  type: string; //day|week
  amount: number; // 500
  value: number; // 7
};

interface RentalSchema extends Document {
  vehicleId: mongoose.Schema.Types.ObjectId; // vehicles
  bussinessId: mongoose.Schema.Types.ObjectId; // bussinessAccounts
  riderId: mongoose.Schema.Types.ObjectId; // riders
  plan: Plan;
  rentalEndDate: Date;
  status: number;
  returnDate: Date;
  returnStatus: number; // [0,1,2] ['On-time','early_return','delayed']
}

const rentalSchema = new Schema<RentalSchema>(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.vehicles,
      required: true,
    },
    bussinessId: {
      type: Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.bussinessAccounts,
      required: true,
    },
    riderId: { type: Schema.Types.ObjectId, ref: DB_COLLECTIONS.riders },
    plan: {
      type: {
        type: String,
        enum: ["day", "week"],
        required: true,
      },
      amount: { type: Number, required: true },
      value: { type: Number, required: true },
    },
    rentalEndDate: { type: Date, required: true },
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // [0,1,2][created,riderAssigned,ended]
    returnDate: { type: Date },
    returnStatus: {
      type: Number,
      enum: [0, 1, 2], // 0: On-time, 1: Early return, 2: Delayed
    },
  },
  {
    timestamps: true,
  }
);

export const rentalModel =
  mongoose.models[DB_COLLECTIONS.rentals] ||
  mongoose.model<RentalSchema>(DB_COLLECTIONS.rentals, rentalSchema);
