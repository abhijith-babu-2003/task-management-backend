import mongoose, { Document, Schema } from "mongoose";

export interface IBoard extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  columns: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100 
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  columns: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Column' 
  }],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


BoardSchema.index({ owner: 1 });
BoardSchema.index({ members: 1 });

BoardSchema.methods.memberCount = function (): number {
  return this.members?.length ?? 0;
};

export default mongoose.model<IBoard>('Board', BoardSchema);