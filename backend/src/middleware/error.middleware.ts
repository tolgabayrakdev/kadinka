import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exception/http.exception.js';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof HttpException) {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            timestamp: new Date().toISOString(),
            path: req.path,
        });
    }

    return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: req.path,
    });
};