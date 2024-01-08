"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = void 0;
const create_router_from_metadata_js_1 = require("./create-router-from-metadata.js");
function createRoutes(app, controllers) {
    for (const controller of controllers) {
        const router = (0, create_router_from_metadata_js_1.createRouterFromMetadata)(controller);
        app.use(router);
    }
}
exports.createRoutes = createRoutes;
