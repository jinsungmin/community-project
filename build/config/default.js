"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const dotenv = __importStar(require("dotenv"));
dotenv.config();
module.exports = {
    host: 'https://54.180.143.210:80',
    database: {
        database: 'TEST',
        connectionLimit: 20,
        timezone: 'utc',
        charset: 'utf8mb4',
        debug: []
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    swagger: {
        id: 'jinjin',
        password: '3380'
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        tempBucket: 'jinjin-bucket',
        cloudfront: 'https://darj2zud5au9j.cloudfront.net',
        bucket: 'jinjin-bucket',
        social: {
            clientId: '406813698983-btoquhiheu24g2gdagolhdg2snn260q6.apps.googleusercontent.com',
            clientSecret: 'SCHRcvCU3zXXKsqhFuRsHXS9'
        }
    }
};
