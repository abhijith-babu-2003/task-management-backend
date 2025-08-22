import mongoose, { Document, Schema } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profileImage: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=UserSchema.js.map