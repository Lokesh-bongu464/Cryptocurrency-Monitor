import mongoose, { Document, Schema } from "mongoose";

export interface IAlert extends Document {
  userId: string;
  coinId: string;
  threshold: number;
  condition: "above" | "below";
  isTriggered: boolean;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    coinId: { type: String, required: true },
    threshold: { type: Number, required: true },
    condition: { type: String, required: true, enum: ["above", "below"] },
    isTriggered: { type: Boolean, default: false },
    lastTriggered: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>("Alert", AlertSchema);
