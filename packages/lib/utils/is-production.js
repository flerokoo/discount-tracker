"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = void 0;
function isProduction() {
    return process.env.NODE_ENV?.toLowerCase() === 'production';
}
exports.isProduction = isProduction;
