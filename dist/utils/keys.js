"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.userKeyById = exports.getKeyName = void 0;
const getKeyName = (...args) => {
    return args.join(":");
};
exports.getKeyName = getKeyName;
// Single user key
const userKeyById = (id) => {
    return (0, exports.getKeyName)("user", id);
};
exports.userKeyById = userKeyById;
// All users (no pagination)
const allUsers = () => {
    return (0, exports.getKeyName)("user");
};
exports.allUsers = allUsers;
