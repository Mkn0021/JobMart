import { User } from "@/types/user.type";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document, Omit<User, 'id'> {
    _id: mongoose.Types.ObjectId;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
    toJSON(): Omit<User, 'password' | 'refreshTokenHash' | 'otp' | 'otpExpiry' | 'googleId'>;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    profileImageUrl: { type: String, required: false },

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



const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;