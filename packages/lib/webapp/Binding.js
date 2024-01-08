"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.Binding = void 0;
class Binding {
    token;
    value;
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    as(token) {
        this.token = token;
        return this;
    }
}
exports.Binding = Binding;
const bind = (type) => new Binding(type.name, type);
exports.bind = bind;
