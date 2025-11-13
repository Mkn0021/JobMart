import { z } from 'zod';

export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
    details?: unknown;
}

export interface HandlerResult<T> {
    data?: T;
    message?: string;
    statusCode?: number;
    file?: { buffer: Buffer; fileName: string; contentType: string };
    cookies?: { name: string; value: string; maxAge?: number }[];
    headers?: Record<string, string>;
}

export interface MongooseErrorDetails {
    statusCode: number;
    message: string;
}

export interface ValidationSchema {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
}

export type ValidateResult<T extends ValidationSchema | undefined> = T extends ValidationSchema ? z.infer<T> : Record<string, never>;