"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtValidator = void 0;
const createJwtValidator = (service) => (token) => {
    const user = service.verifyJwt(token);
    return user;
};
exports.createJwtValidator = createJwtValidator;
