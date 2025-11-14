"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/_ui/Button";
import InputBox from "@/components/_ui/InputBox";
import React, { useState, useEffect } from "react";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
}

const AuthForm: React.FC = () => {
    const router = useRouter();
    const [mode, setMode] = useState<
        "login" | "signup" | "setPassword" | "otp"
    >("login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
    });

    useEffect(() => {
        setError("");
        setSuccess("");
    }, [mode]);

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Signup - Step 1: Name and Email
        if (mode === "signup") {
            if (!formData.name.trim()) {
                setError("Please enter your name");
                return;
            }
            if (!formData.email.trim()) {
                setError("Please enter your email");
                return;
            }
            // Move to Set Password step
            setMode("setPassword");
        }

        // Signup - Step 2: Set Password
        else if (mode === "setPassword") {
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            setLoading(true);
            try {
                

                // Move to OTP verification
                setMode("otp");
                setSuccess("");
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        // Signup - Step 3: OTP Verification
        else if (mode === "otp") {
            if (formData.otp.length !== 6) {
                setError("Please enter a valid 6-digit OTP");
                return;
            }

            setLoading(true);
            try {

                setMode("login");
                updateFormData("otp", "");
                setSuccess("");
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        // Login
        else if (mode === "login") {
            if (!formData.email.trim()) {
                setError("Please enter your email");
                return;
            }
            if (!formData.password.trim()) {
                setError("Please enter your password");
                return;
            }

            setLoading(true);
            try {
                

                router.push("/dashboard");
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email.trim()) {
            setError("Please enter your email address first");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // TODO: Implement forgot password flow
            setSuccess("");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth login functionality
    };

    const handleResendOTP = async () => {
        // TODO: Implement resend OTP functionality
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-neutral-800">
                    {mode === "otp"
                        ? "Verify Email"
                        : mode === "setPassword"
                            ? "Set Password"
                            : mode === "login"
                                ? "Welcome Back"
                                : "Create Account"}
                </h1>
                <p className="text-neutral-600">
                    {mode === "otp"
                        ? "Enter the OTP sent to your email"
                        : mode === "setPassword"
                            ? "Create a secure password for your account"
                            : mode === "login"
                                ? "Sign in to continue"
                                : "Sign up to get started"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {/* OTP Verification Step */}
                {mode === "otp" ? (
                    <>
                        <InputBox
                            label="OTP Code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={formData.otp}
                            onChange={(e) =>
                                updateFormData(
                                    "otp",
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            maxLength={6}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="w-full text-center text-sm text-orange-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Resend OTP"}
                        </button>
                    </>
                ) : mode === "setPassword" ? (
                    <>
                        <InputBox
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) =>
                                updateFormData("password", e.target.value)
                            }
                            disabled={loading}
                        />
                        <InputBox
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                updateFormData(
                                    "confirmPassword",
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Complete Signup"}
                        </Button>
                    </>
                ) : (
                    <>
                        {mode === "signup" && (
                            <InputBox
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) =>
                                    updateFormData("name", e.target.value)
                                }
                                disabled={loading}
                            />
                        )}

                        <InputBox
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                                updateFormData("email", e.target.value)
                            }
                            disabled={loading}
                        />

                        {mode === "login" && (
                            <>
                                <InputBox
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        updateFormData(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                />

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        disabled={loading}
                                        className="text-sm text-orange-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? mode === "login"
                                    ? "Signing In..."
                                    : "Processing..."
                                : mode === "login"
                                    ? "Sign In"
                                    : "Continue"}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-neutral-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full flex items-center justify-center gap-2 text-neutral-700"
                            onClick={handleGoogleLogin}
                        >
                            <IconBrandGoogleFilled size={20} className="text-neutral-600" />
                            Continue with Google
                        </Button>
                    </>
                )}
            </form>

            {mode !== "otp" && mode !== "setPassword" && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-600">
                        {mode === "login"
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            onClick={() =>
                                setMode(mode === "login" ? "signup" : "login")
                            }
                            className="font-medium text-orange-600 hover:underline"
                        >
                            {mode === "login" ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            )}

            {mode === "otp" && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode("signup")}
                        className="text-sm text-neutral-700 hover:underline"
                    >
                        ← Back to Sign Up
                    </button>
                </div>
            )}

            {mode === "setPassword" && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode("otp")}
                        className="text-sm text-neutral-700 hover:underline"
                    >
                        ← Change Email Address
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuthForm;
