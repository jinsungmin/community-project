"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_dist_1 = __importDefault(require("swagger-ui-dist"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const config_1 = __importDefault(require("config"));
const generator_1 = __importDefault(require("./generator"));
const package_json_1 = __importDefault(require("../../../../package.json"));
const swaggerConfig = config_1.default.get('swagger');
const router = express_1.default.Router();
if (process.env.NODE_ENV !== 'production') {
    const swaggerFile = 'doc.json';
    const userDoc = generator_1.default('/front');
    userDoc.info.title = `${userDoc.info.title} 사용자 api`;
    const adminDoc = generator_1.default('/admin');
    adminDoc.info.title = `${adminDoc.info.title} 관리자 api`;
    const description = '\n' +
        `- [${userDoc.info.title}](/swagger)\n` +
        `- [${adminDoc.info.title}](/swagger/admin)\n`;
    userDoc.info.description += description;
    adminDoc.info.description += description;
    router.use(express_basic_auth_1.default({
        users: { [swaggerConfig.id]: swaggerConfig.password },
        challenge: true,
        realm: `${package_json_1.default.name} ${process.env.NODE_ENV}`
    }));
    router.use('/', (req, res, next) => {
        if (req.url === '/') {
            return res.redirect(`?url=${swaggerFile}`);
        }
        next();
    }, express_1.default.static(swagger_ui_dist_1.default.absolutePath()));
    router.route(`/${swaggerFile}`).get((req, res, next) => {
        try {
            res.status(200).json(userDoc);
        }
        catch (e) {
            next(e);
        }
    });
    router.use('/admin', (req, res, next) => {
        if (req.url === '/') {
            return res.redirect(`?url=${swaggerFile}`);
        }
        next();
    }, express_1.default.static(swagger_ui_dist_1.default.absolutePath()));
    router.route(`/admin/${swaggerFile}`).get((req, res, next) => {
        try {
            res.status(200).json(adminDoc);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.default = router;
