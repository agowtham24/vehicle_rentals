import mongoose, { Schema, Document } from "mongoose";

interface BussinessAccountSchema extends Document {
  name: string;
  email: string;
  mobile: string;
  location: {
    address: string;
    pincode: string;
    state: string;
    lat: number;
    lng: number;
  };
  password: string;
  status: string; //['ACTIVE','IN_ACTIVE']
}

const bussinessAccountSchema = new Schema<BussinessAccountSchema>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    location: {
      address: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    password: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "IN_ACTIVE"], default: "ACTIVE" },
  },
  {
    timestamps: true,
  }
);

export const bussinessAccountModel =
  mongoose.models.bussinessAccounts ||
  mongoose.model<BussinessAccountSchema>(
    "bussinessAccounts",
    bussinessAccountSchema
  );
