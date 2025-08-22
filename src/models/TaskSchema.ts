
import mongoose, { Document, Schema } from 'mongoose';


export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  column: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  order: number;
  createdBy: mongoose.Types.ObjectId;
  comments: IComment[];
}

export const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
    tags: [{ type: String, trim: true }],
    order: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

TaskSchema.index({ column: 1, order: 1 });
TaskSchema.index({ board: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);