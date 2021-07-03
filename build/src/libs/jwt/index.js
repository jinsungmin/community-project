"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRefreshToken = exports.createAdminAccessToken = exports.decodeAdminToken = exports.createAdminToken = exports.createRefreshToken = exports.createAccessToken = exports.decodeToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const privateKey = fs_1.default.readFileSync(`${__dirname}/private.pem`);
const publicKey = fs_1.default.readFileSync(`${__dirname}/public.pem`);
async function createToken(payload, options, secret = privateKey) {
    try {
        return await jsonwebtoken_1.default.sign(payload, secret, options);
    }
    catch (e) {
        throw e;
    }
}
exports.createToken = createToken;
async function decodeToken(token, options, secret = publicKey) {
    try {
        return await jsonwebtoken_1.default.verify(token, secret, options);
    }
    catch (e) {
        throw new Error('invalid_token');
    }
}
exports.decodeToken = decodeToken;
async function createAccessToken(data) {
    try {
        const { userId } = data;
        const payload = { sub: userId };
        return await createToken(payload, {
            algorithm: 'RS256',
            expiresIn: 60 * 60 * 2
        });
    }
    catch (e) {
        throw e;
    }
}
exports.createAccessToken = createAccessToken;
async function createRefreshToken(data, tokenSecret) {
    try {
        const payload = {
            sub: data.userId
        };
        return await createToken(payload, { algorithm: 'HS256' }, tokenSecret);
    }
    catch (e) {
        throw e;
    }
}
exports.createRefreshToken = createRefreshToken;
async function createAdminToken(payload, options, secret = privateKey) {
    try {
        return await jsonwebtoken_1.default.sign(payload, secret, options);
    }
    catch (e) {
        throw e;
    }
}
exports.createAdminToken = createAdminToken;
async function decodeAdminToken(token, options, secret = publicKey) {
    try {
        return await jsonwebtoken_1.default.verify(token, secret, options);
    }
    catch (e) {
        throw new Error('invalid_token');
    }
}
exports.decodeAdminToken = decodeAdminToken;
async function createAdminAccessToken(data) {
    try {
        const { id, role } = data;
        const payload = { sub: id, role };
        return await createAdminToken(payload, {
            algorithm: 'RS256',
            expiresIn: 60 * 60
        });
    }
    catch (err) {
        throw err;
    }
}
exports.createAdminAccessToken = createAdminAccessToken;
async function createAdminRefreshToken(data, tokenSecret) {
    try {
        const { id } = data, rest = __rest(data, ["id"]);
        const payload = Object.assign({ sub: id }, rest);
        return await createAdminToken(payload, {
            algorithm: 'HS256',
            expiresIn: 60 * 60 * 24
        }, tokenSecret);
    }
    catch (e) {
        throw e;
    }
}
exports.createAdminRefreshToken = createAdminRefreshToken;
