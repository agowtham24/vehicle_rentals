import mongoose, {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  PipelineStage,
} from "mongoose";
import Config from "./config";

export async function connectDB() {
  if (Config.DB_URL) {
    await mongoose.connect(Config.DB_URL);
    console.log("Database connected successfully");
  } else {
    throw new Error("MongoDB_url was empty");
  }
}
export async function convertToObjectId(uuid: string) {
  return new mongoose.Types.ObjectId(uuid);
}

// generic class for crud operations for all Models
export class MongooseService {
  private getModel<T extends Document>(collectionName: string): Model<T> {
    return mongoose.model<T>(collectionName);
  }

  async create<T extends Document>(
    collectionName: string,
    data: Partial<T>
  ): Promise<T> {
    const model = this.getModel<T>(collectionName);
    const doc = new model(data);
    return await doc.save();
  }

  async updateOne<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    const model = this.getModel<T>(collectionName);
    return await model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async deleteOne<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T>
  ): Promise<T | null> {
    const model = this.getModel<T>(collectionName);
    return await model.findOneAndDelete(filter).exec();
  }

  async aggregate<T extends Document>(
    collectionName: string,
    pipeline: PipelineStage[]
  ): Promise<any[]> {
    const model = this.getModel<T>(collectionName);
    return await model.aggregate(pipeline).exec();
  }
}
