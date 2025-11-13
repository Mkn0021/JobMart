import APIError from "./error";
import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/middlewares/error-handler";
import type { ErrorResponse, HandlerResult, SuccessResponse } from "@/types/api.type";

export const apiResponse = {
    success: <T>(
        data: T,
        message?: string,
        statusCode = 200,
        options?: {
            file?: { buffer: Buffer; fileName: string; contentType: string };
            cookies?: { name: string; value: string; maxAge?: number }[];
            headers?: Record<string, string>;
        }
    ): NextResponse<SuccessResponse<T>> => {
        const response = NextResponse.json(
            { success: true, data, message } as SuccessResponse<T>,
            { status: statusCode }
        );

        if (options?.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }

        if (options?.cookies) {
            options.cookies.forEach(cookie => {
                response.cookies.set(cookie.name, cookie.value, { maxAge: cookie.maxAge });
            });
        }

        if (options?.file) {
            const { buffer, fileName, contentType } = options.file;
            return new NextResponse(buffer as any, {
                status: statusCode,
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    ...options.headers,
                },
            }) as NextResponse<SuccessResponse<T>>;
        }

        return response;
    },

    error: (
        error: string | APIError | Error,
        statusCode = 500
    ): NextResponse<ErrorResponse> => {
        if (error instanceof APIError) {
            const responseBody: ErrorResponse & { details?: unknown } = {
                success: false,
                error: error.message,
            };
            if (error.details) {
                responseBody.details = error.details;
            }
            return NextResponse.json(responseBody, { status: error.statusCode });
        }

        const message = error instanceof Error ? error.message : error;
        return NextResponse.json(
            { success: false, error: message },
            { status: statusCode }
        );
    },
};

export const asyncHandler = <T>(
    handler: (req: NextRequest) => Promise<HandlerResult<T>>
) => {
    return async (req: NextRequest) => {
        try {
            // Ensure database connection
            await connectDB();

            const result = await handler(req);

            return apiResponse.success(
                result.data ?? null,
                result.message,
                result.statusCode || 200,
                {
                    ...(result.file ? { file: result.file } : {}),
                    ...(result.cookies ? { cookies: result.cookies } : {}),
                    ...(result.headers ? { headers: result.headers } : {})
                }
            );
        } catch (error) {
            return errorHandler(error);
        }
    };
};