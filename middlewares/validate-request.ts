import { NextRequest } from 'next/server';
import type { ValidateResult, ValidationSchema } from '@/types/api.type';

export const validateRequest = async <T extends ValidationSchema | undefined>(
    req: NextRequest,
    schema?: T,
    params?: Record<string, string>
): Promise<ValidateResult<T>> => {
    if (!schema) return {} as ValidateResult<T>;

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams);

    const results: Record<string, unknown> = {};

    if (schema.query) {
        results.query = await schema.query.parseAsync(queryParams);
    }

    if (schema.params && params) {
        results.params = await schema.params.parseAsync(params);
    }

    if (schema.body && req.method !== 'GET' && req.method !== 'HEAD') {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        results.body = await schema.body.parseAsync(body);
    }

    return results as ValidateResult<T>;
};