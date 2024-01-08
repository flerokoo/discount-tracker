"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const errors_js_1 = require("../../utils/errors.js");
const handle_error_js_1 = require("../handle-error.js");
const request_context_js_1 = require("../request-context.js");
// export const createAuthenticatorMiddlware =
//   (validateToken: JwtTokenValidator) =>
//   (req: Request, res: Response, next: () => void) => {
//     const token = req.header('Authorization');
//     if (!token) {
//       next();
//       return;
//     }
//     try {
//       const user = validateToken(token);
//       setCurrentUser(user);
//       next();
//     } catch (err) {
//       handleError(new AuthenticationError('Token is not valid'), res);
//     }
//   };
const checkAuth = async (req, res, next) => {
    if (!(0, request_context_js_1.hasCurrentUser)()) {
        (0, handle_error_js_1.handleError)(new errors_js_1.AuthorizationError('No access token found, not authorized'), res);
        return;
    }
    next();
};
exports.checkAuth = checkAuth;
