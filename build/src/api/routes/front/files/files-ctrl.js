"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesUpload = void 0;
const uuid_1 = require("uuid");
const mime_types_1 = __importDefault(require("mime-types"));
const loaders_1 = require("../../../../loaders");
async function getFilesUpload(req, res, next) {
    try {
        const { mimeType, type } = req.options;
        const extensions = mime_types_1.default.extensions[mimeType];
        if (type === 'image' && !mimeType.startsWith('image/')) {
            throw new Error('bad_mimeType');
        }
        const key = `${uuid_1.v4()}.${extensions[0]}`;
        const ret = await loaders_1.aws.generatePreSignedUrl(key, mimeType);
        res.status(200).json(ret);
    }
    catch (e) {
        if (e.message === 'bad_mimeType')
            e.status = 400;
        next(e);
    }
}
exports.getFilesUpload = getFilesUpload;
