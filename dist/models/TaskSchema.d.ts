import mongoose, { Document } from 'mongoose';
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
export declare const CommentSchema: mongoose.Schema<IComment, mongoose.Model<IComment, any, any, any, mongoose.Document<unknown, any, IComment, any, {}> & IComment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IComment, mongoose.Document<unknown, {}, mongoose.FlatRecord<IComment>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IComment> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TaskSchema.d.ts.map