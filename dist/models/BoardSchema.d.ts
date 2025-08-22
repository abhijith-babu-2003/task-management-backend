import mongoose, { Document } from "mongoose";
export interface IBoard extends Document {
    name: string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    columns: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBoard, {}, {}, {}, mongoose.Document<unknown, {}, IBoard, {}, {}> & IBoard & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=BoardSchema.d.ts.map