import bcrypt from "bcrypt";
import { User, SafeUser } from "@/types/user.type";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document, Omit<User, 'id'> {
    _id: mongoose.Types.ObjectId;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
    toJSON(): SafeUser;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    profileImageUrl: { type: String, required: false },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },

    educationLevel: { type: String, enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Other'], required: false },

    experienceLevel: { type: String, enum: ['Fresher', 'Junior', 'Mid', 'Senior'], default: 'Fresher' },
    cvText: { type: String, required: false },

    skills: { type: [String], default: [] },
    experiences: { type: [String], default: [] },
    desiredJobRoles: { type: [String], default: [] },
    desiredLocations: { type: [String], default: [] },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (providedPassword: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(providedPassword, this.password);
};

UserSchema.methods.toJSON = function (): SafeUser {
    const userObject = this.toObject();
    const { password, otp, otpExpiry, googleId, __v, ...safeUser } = userObject;
    safeUser.id = safeUser._id.toString();
    delete safeUser._id;
    return safeUser;
};


const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;