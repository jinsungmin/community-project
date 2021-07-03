"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.createPasswordHash = exports.generateRandomHash = exports.generateRandomPassword = exports.generateRandomCode = exports.passwordIterations = void 0;
const crypto_1 = __importDefault(require("crypto"));
const passwordIterations = {
    user: 123144,
    admin: 133246,
    seller: 142123,
    phone: 143243
};
exports.passwordIterations = passwordIterations;
function generateRandomCode(digit) {
    const max = 10 ** digit;
    const min = 10 ** (digit - 1);
    return Math.floor(Math.random() * (max - min) + min);
}
exports.generateRandomCode = generateRandomCode;
function generateRandomPassword(digit) {
    return Math.random().toString(36).slice(-digit);
}
exports.generateRandomPassword = generateRandomPassword;
function generateRandomHash(length) {
    return crypto_1.default
        .randomBytes(length)
        .toString('base64')
        .replace(/[^A-Za-z0-9]/g, '');
}
exports.generateRandomHash = generateRandomHash;
const createPasswordHash = (password, iterations) => {
    try {
        const salt = generateRandomHash(64);
        const key = crypto_1.default.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
        return { password: key.toString('base64'), salt };
    }
    catch (e) {
        throw e;
    }
};
exports.createPasswordHash = createPasswordHash;
function verifyPassword(password, hash, salt, iterations) {
    try {
        const key = crypto_1.default.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
        return key.toString('base64') === hash;
    }
    catch (e) {
        return false;
    }
}
exports.verifyPassword = verifyPassword;
