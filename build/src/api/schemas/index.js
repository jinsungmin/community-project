"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.getSchemas = exports.getSchema = void 0;
const ajv_1 = __importDefault(require("ajv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loaders_1 = require("../../loaders");
const entries = assignAllJson(__dirname, []);
const defaultAjv = new ajv_1.default({
    schemas: entries,
    useDefaults: true,
    removeAdditional: true,
    coerceTypes: 'array',
    nullable: true
});
function getReferences(obj, ref) {
    const ret = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (obj[key] instanceof Object)
            ret.push(...getReferences(obj[key], ref));
        else if (key === ref)
            ret.push(obj[key]);
    });
    return ret;
}
function assignAllJson(dir, all) {
    try {
        fs_1.default.readdirSync(dir).forEach((target) => {
            const targetDir = path_1.default.join(dir, target);
            if (fs_1.default.statSync(targetDir).isDirectory()) {
                assignAllJson(targetDir, all);
            }
            else if (target.endsWith('.json')) {
                const key = targetDir.replace(`${__dirname}/`, '').replace('.json', '');
                const file = fs_1.default.readFileSync(path_1.default.join(__dirname, `${key}.json`));
                const schema = JSON.parse(file.toString());
                schema.$id = key;
                const refs = getReferences(schema, '$ref');
                schema.components = { schemas: {} };
                refs.forEach((ref) => {
                    if (ref.startsWith('#/components/schemas/')) {
                        const refId = ref.replace('#/components/schemas/', '').replace(/~0/g, '~').replace(/~1/g, '/');
                        schema.components.schemas[refId] = getSchema(refId);
                    }
                });
                all.push(schema);
            }
        });
    }
    catch (e) {
        loaders_1.logger.fatal(e);
    }
    return all;
}
function getSchema(id) {
    const file = fs_1.default.readFileSync(path_1.default.join(__dirname, `${id}.json`));
    return JSON.parse(file.toString());
}
exports.getSchema = getSchema;
function getSchemas(source) {
    return [
        ...assignAllJson(path_1.default.join(__dirname, 'requests', source), []),
        ...assignAllJson(path_1.default.join(__dirname, 'responses', source), []),
        ...assignAllJson(path_1.default.join(__dirname, 'common'), [])
    ];
}
exports.getSchemas = getSchemas;
function validate(data, schema, options) {
    const validate = defaultAjv.getSchema(schema);
    if (!validate)
        throw new Error('undefined_schema');
    if (!validate(data)) {
        throw new Error(defaultAjv.errorsText(validate.errors));
    }
}
exports.validate = validate;
