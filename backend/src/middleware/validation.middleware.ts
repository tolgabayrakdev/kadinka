import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { BadRequestException } from '../exception/http.exception.js';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error: any) {
            const errors = error.errors?.map((e: any) => e.message).join(', ');
            next(new BadRequestException(errors || 'Validation failed'));
        }
    };
};