"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrentUser = exports.getCurrentUser = exports.hasCurrentUser = exports.runRequestWithinContext = void 0;
const async_hooks_1 = require("async_hooks");
const contextStorage = new async_hooks_1.AsyncLocalStorage();
function runRequestWithinContext(context, fn) {
    contextStorage.run(context, fn);
}
exports.runRequestWithinContext = runRequestWithinContext;
function hasCurrentUser() {
    return Boolean(contextStorage.getStore()?.user);
}
exports.hasCurrentUser = hasCurrentUser;
function getCurrentUser() {
    return contextStorage.getStore()?.user;
}
exports.getCurrentUser = getCurrentUser;
function setCurrentUser(user) {
    const store = contextStorage.getStore();
    store.user = user;
}
exports.setCurrentUser = setCurrentUser;
