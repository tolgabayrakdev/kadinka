export class HttpException extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = 'Resource not found') {
        super(404, message);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad request') {
        super(400, message);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
        super(409, message);
    }
}