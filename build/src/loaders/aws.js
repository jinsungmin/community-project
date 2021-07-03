"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePreSignedUrl = exports.copyTempObject = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("config"));
const awsConfig = config_1.default.get('aws');
aws_sdk_1.default.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
    apiVersions: {
        s3: '2006-03-01'
    }
});
const s3 = new aws_sdk_1.default.S3();
async function copyTempObject(path, prefix = '') {
    try {
        if (!path)
            return path;
        const url = new URL(path);
        return url.href;
    }
    catch (e) {
        try {
            const targetKey = `${prefix}/${path}`;
            const params = {
                Bucket: awsConfig.bucket,
                CopySource: `${awsConfig.tempBucket}/${path}`,
                Key: `${targetKey}`,
                CacheControl: 'max-age=31536000'
            };
            await s3.copyObject(params).promise();
            return `${awsConfig.cloudfront}/${targetKey}`;
        }
        catch (e) {
            e.status = e.statusCode;
            throw e;
        }
    }
}
exports.copyTempObject = copyTempObject;
function generatePreSignedUrl(key, mimeType) {
    try {
        const params = {
            Bucket: awsConfig.tempBucket,
            Key: key,
            ContentType: mimeType,
            Expires: 60
        };
        return {
            path: key,
            url: s3.getSignedUrl('putObject', params)
        };
    }
    catch (e) {
        throw e;
    }
}
exports.generatePreSignedUrl = generatePreSignedUrl;
