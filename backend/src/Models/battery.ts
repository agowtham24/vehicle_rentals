import mongoose, { Schema, Document } from "mongoose";

interface BatterySchema extends Document {
  name: string;
  manufactureBy: string;
  manufacturingDate: Date;
  PurchaseDate: Date;
  status: string;
}

const batterySchema = new Schema<BatterySchema>({
  name: { type: String, required: true },
  manufactureBy: { type: String, required: true },
  manufacturingDate: { type: Date },
  PurchaseDate: { type: Date },
  status: { type: String, enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"] },
});

export const batteryModel =
  mongoose.models.batteries ||
  mongoose.model<BatterySchema>("batteries", batterySchema);
