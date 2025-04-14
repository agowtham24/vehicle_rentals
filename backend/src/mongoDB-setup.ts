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

  async create<T extends Document>(collectionName: string, data: Partial<T>) {
    const model = this.getModel<T>(collectionName);
    const doc = new model(data);
    return await doc.save();
  }

  async updateOne<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async updateMany<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.updateMany(filter, update).exec();
  }

  async deleteOne<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T>
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.findOneAndDelete(filter).exec();
  }

  async aggregate<T extends Document>(
    collectionName: string,
    pipeline: PipelineStage[]
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.aggregate(pipeline).exec();
  }

  async find<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T> = {},
    projection: any = {},
    options: any = {}
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.find(filter, projection, options).lean().exec();
  }

  async findOne<T extends Document>(
    collectionName: string,
    filter: FilterQuery<T> = {},
    projection: any = {},
    options: any = {}
  ) {
    const model = this.getModel<T>(collectionName);
    return await model.findOne(filter, projection, options).lean().exec();
  }
}
