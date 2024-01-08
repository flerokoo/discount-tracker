"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = void 0;
const OK_STATUS = 'success';
function success(message) {
    if (!message) {
        return { status: OK_STATUS };
    }
    else if (typeof message === 'object') {
        return {
            payload: message,
            status: OK_STATUS
        };
    }
    else if (typeof message === 'string') {
        return {
            message,
            status: OK_STATUS
        };
    }
    else {
        throw new Error('Unexpected success payload');
    }
}
exports.success = success;
