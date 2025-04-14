import mongoose, { Schema, Document } from "mongoose";
import Config from "../config";
const DB_COLLECTIONS = Config.DB_COLLECTIONS;
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
  role: string;
}

const bussinessAccountSchema = new Schema<BussinessAccountSchema>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    role: { type: String, enum: ["ADMIN", "TENANT"] },
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
  mongoose.models[DB_COLLECTIONS.bussinessAccounts] ||
  mongoose.model<BussinessAccountSchema>(
    DB_COLLECTIONS.bussinessAccounts,
    bussinessAccountSchema
  );
