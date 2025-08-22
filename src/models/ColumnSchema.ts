import mongoose, { Document, Schema } from 'mongoose';

export interface IColumn extends Document {
  name: string;
  board: mongoose.Types.ObjectId;
  order: number;
  tasks: mongoose.Types.ObjectId[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    color: {
      type: String,
      default: '#6B7280',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ColumnSchema.index({ board: 1, order: 1 });

ColumnSchema.virtual('taskCount').get(function () {
  return this.tasks ? this.tasks.length : 0;
});

export default mongoose.model<IColumn>('Column', ColumnSchema);