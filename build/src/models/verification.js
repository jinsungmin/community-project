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
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.findOne = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const code_1 = require("../libs/code");
const tableName = 'Verifications';
exports.tableName = tableName;
async function create(options, connection) {
    const { phone, type } = options;
    try {
        const code = code_1.generateRandomCode(6);
        const { insertId } = await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?
        ON DUPLICATE KEY UPDATE code = VALUES(code), confirmed = false, used = false, createdAt = NOW()`,
            values: [tableName, { phone, code, type }]
        });
        return { id: insertId, phone, code: code.toString(), type, confirmed: false, used: false };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findOne({ id, type, phone, confirmed, used }) {
    try {
        const where = [];
        if (type)
            where.push(`type = '${type}'`);
        if (id)
            where.push(`id = ${id}`);
        if (phone)
            where.push(`phone = '${phone}'`);
        if (confirmed)
            where.push(`confirmed = ${confirmed}`);
        if (typeof used !== 'undefined')
            where.push(`used = ${used}`);
        const [row] = await loaders_1.db.query({
            sql: `SELECT * FROM ?? WHERE ${where.join(' AND ')}`,
            values: [tableName]
        });
        return row;
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function update(options, connection) {
    const { id } = options, data = __rest(options, ["id"]);
    try {
        const { affectedRows } = await loaders_1.db.query({
            connection,
            sql: `UPDATE ?? SET ? WHERE ? `,
            values: [tableName, data, { id }]
        });
        if (affectedRows > 0)
            return options;
    }
    catch (e) {
        throw e;
    }
}
exports.update = update;
