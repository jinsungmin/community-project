"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyEmail = exports.sendTempPassword = exports.notifyUserRegister = exports.sendUserVerified = exports.sendResetPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("config"));
const mailConfig = config_1.default.get('mail');
const transporter = nodemailer_1.default.createTransport(mailConfig.account);
async function sendToUsers(to, subject, html) {
    try {
        //if (['development', 'production'].indexOf(process.env.NODE_ENV) === -1) return
        if (process.env.NODE_ENV !== 'production')
            subject = `[DEV]${subject}`;
        if (to.length) {
        }
        const mailOptions = {
            from: mailConfig.sender,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
    }
    catch (e) {
        throw e;
    }
}
async function sendToAdmins(to, subject, html) {
    try {
        //if (['development', 'production'].indexOf(process.env.NODE_ENV) === -1) return
        if (process.env.NODE_ENV !== 'production')
            subject = `[DEV]${subject}`;
        const mailOptions = {
            from: mailConfig.sender,
            to: mailConfig.sender,
            cc: to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
    }
    catch (e) {
        throw e;
    }
}
async function sendVerifyEmail(to, code) {
    try {
        const subject = '이메일 인증';
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/verifyEmailSend.ejs'), { code }, { async: true });
        await sendToUsers(to, subject, html);
    }
    catch (e) {
        throw e;
    }
}
exports.sendVerifyEmail = sendVerifyEmail;
async function sendUserVerified(to, name, type) {
    try {
        const subject = '사용자 서비스 인증 완료';
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/sendUserVerified.ejs'), { name, type }, { async: true });
        await sendToUsers(to, subject, html);
    }
    catch (e) {
        throw e;
    }
}
exports.sendUserVerified = sendUserVerified;
async function notifyUserRegister(to, username, type, email) {
    try {
        const subject = '잇다 사용자 가입';
        const emailAdmins = [];
        to.data.map((row) => emailAdmins.push(row.email));
        console.log('email::', emailAdmins);
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/notifyUserRegister.ejs'), { username, type, email }, { async: true });
        await sendToAdmins(emailAdmins, subject, html);
    }
    catch (e) {
        throw e;
    }
}
exports.notifyUserRegister = notifyUserRegister;
async function sendResetPassword(to, name, url) {
    try {
        const subject = '패스워드 변경';
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/resetPasswordEmailSend.ejs'), { name, url }, { async: true });
        await sendToUsers(to, subject, html);
    }
    catch (e) {
        throw e;
    }
}
exports.sendResetPassword = sendResetPassword;
async function sendTempPassword(to, name, password) {
    try {
        const subject = '임시 패스워드 발급';
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/resetPasswordResult.ejs'), { name, password }, { async: true });
        await sendToUsers(to, subject, html);
    }
    catch (e) {
        throw e;
    }
}
exports.sendTempPassword = sendTempPassword;
