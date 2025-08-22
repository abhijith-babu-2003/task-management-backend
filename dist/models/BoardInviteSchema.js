import mongoose, { Schema, Document, Types } from 'mongoose';
const BoardInviteSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    inviter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
BoardInviteSchema.index({ board: 1, email: 1 }, { unique: true });
BoardInviteSchema.virtual('inviteUrl').get(function () {
    return `${process.env.FRONTEND_URL}/invite/${this.token}`;
});
BoardInviteSchema.methods.isExpired = function () {
    return this.expiresAt < new Date();
};
const BoardInvite = mongoose.models.BoardInvite || mongoose.model('BoardInvite', BoardInviteSchema);
export default BoardInvite;
//# sourceMappingURL=BoardInviteSchema.js.map