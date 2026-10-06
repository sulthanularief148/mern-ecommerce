// Consistent response envelope across every endpoint: { success, message, data }.
// Keeping this uniform is what lets the frontend handle responses generically
// instead of every page guessing the shape of each endpoint's payload.
export class ApiResponse {
    constructor(statusCode, data = null, message = 'Success') {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export function sendResponse(res, statusCode, data, message) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
}
