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
exports.deleteOne = exports.updateOne = exports.updatePassword = exports.findOne = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const index_1 = require("./index");
const tableName = 'Users';
exports.tableName = tableName;
async function create(options, connection) {
    try {
        const { name, email, profileUrl, createdAt = new Date() } = options;
        const { insertId } = await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {
                    name,
                    email,
                    profileUrl,
                    createdAt
                }
            ]
        });
        return { id: insertId, name, email, profileUrl, createdAt };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findOne(options) {
    try {
        const { id, name, accountId } = options;
        const where = [];
        if (id)
            where.push(`u.id = ${id}`);
        if (name)
            where.push(`u.name = '${name}'`);
        if (accountId)
            where.push(`a.accountId = '${accountId}'`);
        const [row] = await loaders_1.db.query({
            sql: `SELECT u.*, a.accountId as email
      FROM ?? u
        JOIN ?? a ON a.userId = u.id
      WHERE ${where.join(' AND ')}
      GROUP BY u.id`,
            values: [tableName, index_1.Account.tableName]
        });
        return row;
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function updatePassword(options, connection) {
    try {
        const { id, password, salt } = options;
        await loaders_1.db.query({
            connection,
            sql: `UPDATE ?? SET ? WHERE ?`,
            values: [
                tableName,
                {
                    password,
                    salt
                },
                { id }
            ]
        });
    }
    catch (e) {
        throw e;
    }
}
exports.updatePassword = updatePassword;
async function updateOne(options, connection) {
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
exports.updateOne = updateOne;
async function deleteOne(id, connection) {
    try {
        const { affectedRows } = await loaders_1.db.query({
            connection,
            sql: `DELETE FROM ?? WHERE ? `,
            values: [tableName, { id }]
        });
        if (affectedRows > 0)
            return id;
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;
