import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  merchantId: mongoose.Types.ObjectId;
  subject: string;
  category: 'billing' | 'technical' | 'shipping' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: Array<{
    senderId: mongoose.Types.ObjectId;
    senderRole: 'merchant' | 'admin';
    senderName: string;
    content: string;
    createdAt: Date;
  }>;
  assignedTo?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, index: true },
    subject: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['billing', 'technical', 'shipping', 'general'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true
    },
    messages: [{
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      senderRole: { type: String, enum: ['merchant', 'admin'], required: true },
      senderName: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date
  },
  { timestamps: true }
);

// Compound index for Super Admin filtering and analytics
ticketSchema.index({ merchantId: 1, status: 1, priority: 1, createdAt: -1 });

export default mongoose.model<ITicket>('Ticket', ticketSchema);
