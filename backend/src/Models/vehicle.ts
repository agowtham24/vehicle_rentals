import mongoose, { Schema, Document } from "mongoose";

type Plan = {
  type: string; //day|week
  amount: number; // 500
  value: number; // 7
};

interface VehicleSchema extends Document {
  vehicleUid: string;
  vehicleNumber: string;
  assosiatedBatteries: [mongoose.Schema.Types.ObjectId];
  status: string; //enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"]
  riderId: mongoose.Schema.Types.ObjectId;
  rentalId: mongoose.Schema.Types.ObjectId;
  vehicleModelId: mongoose.Schema.Types.ObjectId;
  plan: Plan;
  image: string;
  registrationNo: string;
  registeryName: string;
  registrationDate: Date;
}

const vehicleSchema = new Schema<VehicleSchema>({
  vehicleUid: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  assosiatedBatteries: [{ type: Schema.Types.ObjectId, ref: "batteries" }],
  status: {
    type: String,
    enum: ["READY_TO_ASSIGN", "ASSIGNED", "IN_SERVICE"],
    default: "READY_TO_ASSIGN",
  },
  riderId: { type: Schema.Types.ObjectId, ref: "riders" },
  rentalId: { type: Schema.Types.ObjectId, ref: "rentals" },
  vehicleModelId: { type: Schema.Types.ObjectId, ref: "vehicleModels" },
  plan: {
    type: {
      type: String,
      enum: ["day", "week"],
    },
    amount: { type: Number },
    value: { type: Number },
  },
  image: { type: String, required: true },
  registrationNo: { type: String, required: true },
  registeryName: { type: String, required: true },
  registrationDate: { type: Date, required: true },
});

export const vehicleModel =
  mongoose.models.vehicles ||
  mongoose.model<VehicleSchema>("vehicles", vehicleSchema);
