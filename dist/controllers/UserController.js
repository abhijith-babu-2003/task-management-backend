import Users from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import StatusCode from "../Config/StatusCode.js";
dotenv.config();
const JWT_key = process.env.JWT_key || 'hello_key';
export const registerUser = async (req, res) => {
    const { name, email, password, image } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(StatusCode.BAD_REQUEST).json({
                message: "Name, email, and password are required"
            });
            return;
        }
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            res.status(StatusCode.BAD_REQUEST).json({
                message: "User already exists with this email"
            });
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new Users({
            name,
            email,
            password: hashPassword,
            profileImage: image || "",
        });
        await user.save();
        res.status(StatusCode.CREATED).json({
            message: "User registered successfully",
            success: true
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Server error during registration"
        });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(StatusCode.BAD_REQUEST).json({
                message: "Email and password are required"
            });
            return;
        }
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(StatusCode.BAD_REQUEST).json({
                message: "Invalid email or password"
            });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(StatusCode.BAD_REQUEST).json({
                message: "Invalid password"
            });
            return;
        }
        const token = jwt.sign({ id: user._id }, JWT_key, { expiresIn: '24h' });
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
        };
        res.status(StatusCode.OK).json({
            message: "Login successful",
            token,
            user: userData
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Server error during login"
        });
    }
};
export const getCurrentUser = async (req, res) => {
    try {
        const user = await Users.findById(req.user?.id).select('-password');
        if (!user) {
            res.status(StatusCode.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }
        res.status(StatusCode.OK).json({
            message: "User data retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Server error while fetching user data"
        });
    }
};
//# sourceMappingURL=UserController.js.map