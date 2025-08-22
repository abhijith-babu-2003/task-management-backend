import mongoose, { Document } from 'mongoose';
export interface IColumn extends Document {
    name: string;
    board: mongoose.Types.ObjectId;
    order: number;
    tasks: mongoose.Types.ObjectId[];
    color: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IColumn, {}, {}, {}, mongoose.Document<unknown, {}, IColumn, {}, {}> & IColumn & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ColumnSchema.d.ts.map