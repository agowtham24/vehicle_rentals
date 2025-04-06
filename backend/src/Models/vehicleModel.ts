import mongoose, { Schema, Document } from "mongoose";

interface VehicleModelSchema extends Document {
  name: string;
  manufactureBy: string;
  batterySlots: number;
  isSwapable: boolean;
}

const vehicleModelSchema = new Schema<VehicleModelSchema>({
  name: { type: String, required: true },
  manufactureBy: { type: String, required: true },
  batterySlots: { type: Number, default: 1 },
  isSwapable: { type: Boolean, default: false },
});

export const vehicleModel =
  mongoose.models.vehicleModels ||
  mongoose.model<VehicleModelSchema>("vehicleModels", vehicleModelSchema);
