import mongoose, { Document, Schema } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 150 },
    phone: { type: String, trim: true, maxlength: 20 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    idempotencyKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
