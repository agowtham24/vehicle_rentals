import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;

type Plan = {
  type: string; //day|week
  amount: number; // 500
  value: number; // 7
  batteries: number;
  sdAmount: number;
  freeSwaps: number;
  swapCharge: number;
};

interface BussinessPricingSchema extends Document {
  bussinessId: mongoose.Schema.Types.ObjectId;
  vehicleModelId: mongoose.Schema.Types.ObjectId;
  plans: Plan[];
}

const planSchema = new Schema<Plan>(
  {
    type: {
      type: String,
      enum: ["day", "week"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    sdAmount: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    batteries: {
      type: Number,
      default: 1,
      enum: [1, 2],
    },
    freeSwaps: { type: Number, enum: [1, 2, 3, 4, 5] },
    swapCharge: { type: Number },
  },
  { _id: true }
);

const bussinessPricingSchema = new Schema<BussinessPricingSchema>(
  {
    bussinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.bussinessAccounts,
      required: true,
    },
    vehicleModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.vehicleModels,
      required: true,
    },
    plans: { type: [planSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const bussinessPricingModel =
  mongoose.models[DB_COLLECTIONS.bussinessPricings] ||
  mongoose.model<BussinessPricingSchema>(
    DB_COLLECTIONS.bussinessPricings,
    bussinessPricingSchema
  );
