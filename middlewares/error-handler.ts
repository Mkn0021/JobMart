import { ZodError } from "zod";
import mongoose from "mongoose";
import APIError from "@/lib/api/error";
import { NextResponse } from "next/server";
import type { ErrorResponse, MongooseErrorDetails } from "@/types/api.type";

export const errorHandler = (err: unknown): NextResponse<ErrorResponse> => {
    const logMessage = err instanceof ZodError ? err.issues?.[0]?.message : err instanceof Error ? err.message : "Unknown error";
    console.error("API Error:", logMessage);

    if (err instanceof APIError) {
        const { statusCode, message, details } = err;
        const response: ErrorResponse = { success: false, error: message };
        if (details) {
            response.details = details;
        }
        return NextResponse.json(response, { status: statusCode });
    }

    if (err instanceof ZodError) {
        const message = err.issues?.[0]?.message ?? "Validation failed";
        return NextResponse.json<ErrorResponse>(
            { success: false, error: message, details: err.issues },
            { status: 400 }
        );
    }

    if (err instanceof mongoose.Error) {
        const errorDetails: MongooseErrorDetails = (() => {
            if (err instanceof mongoose.Error.ValidationError) {
                return { statusCode: 400, message: "Validation failed for one or more fields" };
            }
            if (err instanceof mongoose.Error.CastError) {
                return {
                    statusCode: 400,
                    message: `Invalid ${err.path} value: ${err.value}`,
                };
            }
            const mongooseErr = err as unknown as Record<string, unknown>;
            if (mongooseErr.code === 11000) {
                return { statusCode: 409, message: "Duplicate entry violates unique constraint" };
            }
            return { statusCode: 500, message: "Database error" };
        })();

        const mongooseErr = err as unknown as Record<string, unknown>;
        const response: ErrorResponse = {
            success: false,
            error: errorDetails.message,
            details: mongooseErr.message
        };
        return NextResponse.json(response, { status: errorDetails.statusCode });
    }

    if (err instanceof SyntaxError && "body" in err) {
        return NextResponse.json<ErrorResponse>(
            { success: false, error: "Malformed JSON in request body" },
            { status: 400 }
        );
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorResponse>(
        { success: false, error: message },
        { status: 500 }
    );
};