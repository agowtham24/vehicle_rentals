import mongoose, { Schema, Document } from "mongoose";

interface RiderSchema extends Document {
  mobile: string;
  status: string;
  isActiveRide: boolean;
  isSdPaid: boolean;
  isRentPaid: boolean;
  sdAmount: number;
  vehicleId: mongoose.Schema.Types.ObjectId;
  rentalId: mongoose.Schema.Types.ObjectId;
  bussinessId: mongoose.Schema.Types.ObjectId;
}

const riderSchema = new Schema<RiderSchema>(
  {
    mobile: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ON_RIDE", "BLACK_LISTED"],
      default: "ACTIVE",
    },
    isActiveRide: { type: Boolean, default: false },
    isSdPaid: { type: Boolean, default: false },
    isRentPaid: { type: Boolean },
    sdAmount: { type: Number },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "vehicles" },
    rentalId: { type: mongoose.Schema.Types.ObjectId, ref: "rentals" },
    bussinessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bussinessAccounts",
    },
  },
  {
    timestamps: true,
  }
);

export const riderModel =
  mongoose.models.riders || mongoose.model<RiderSchema>("riders", riderSchema);
