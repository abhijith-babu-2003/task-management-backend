import mongoose, { Document, Schema } from "mongoose";
const BoardSchema = new Schema({
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
BoardSchema.methods.memberCount = function () {
    return this.members?.length ?? 0;
};
export default mongoose.model('Board', BoardSchema);
//# sourceMappingURL=BoardSchema.js.map