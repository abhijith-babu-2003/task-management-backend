import mongoose, { Document, Types } from 'mongoose';
export interface IBoardInvite extends Document {
    board: Types.ObjectId;
    inviter: Types.ObjectId;
    email: string;
    status: 'pending' | 'accepted' | 'rejected';
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const BoardInvite: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IBoardInvite, {}, {}, {}, mongoose.Document<unknown, {}, IBoardInvite, {}, {}> & IBoardInvite & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default BoardInvite;
//# sourceMappingURL=BoardInviteSchema.d.ts.map