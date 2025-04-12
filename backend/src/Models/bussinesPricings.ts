import mongoose, { Schema, Document } from "mongoose";

type Plan = {
  type: string; //day|week
  amount: number; // 500
  value: number; // 7
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
    value: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const bussinessPricingSchema = new Schema<BussinessPricingSchema>(
  {
    bussinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bussinessAccounts",
      required: true,
    },
    vehicleModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicleModels",
      required: true,
    },
    plans: { type: [planSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const bussinessPricingModel =
  mongoose.models.bussinessPricings ||
  mongoose.model<BussinessPricingSchema>(
    "bussinessPricings",
    bussinessPricingSchema
  );
