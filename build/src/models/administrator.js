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
exports.deleteOne = exports.updateOne = exports.updatePassword = exports.findOneSecret = exports.findOne = exports.findAll = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const tableName = 'Administrators';
exports.tableName = tableName;
async function create(options, connection) {
    try {
        const { name, salt, password, createdAt } = options;
        const { insertId } = await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {
                    name,
                    password,
                    salt,
                    createdAt
                }
            ]
        });
        return { id: insertId, name, createdAt };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findAll(options) {
    try {
        const { search, sort = 'id', order = 'DESC', start, perPage } = options;
        const where = [];
        if (search)
            where.push(`(t.name like '%${search}%' OR t.nickname like '%${search}%')`);
        const rows = await loaders_1.db.query({
            sql: `SELECT t.id, t.name, t.createdAt, t.updatedAt FROM ?? t
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY t.${sort} ${order}
      LIMIT ${start}, ${perPage}`,
            values: [tableName]
        });
        const [rowTotal] = await loaders_1.db.query({
            sql: `SELECT COUNT(1) as total FROM ?? t
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
            values: [tableName]
        });
        return { data: rows, total: rowTotal ? rowTotal.total : 0 };
    }
    catch (e) {
        throw e;
    }
}
exports.findAll = findAll;
async function findOne(id) {
    try {
        const [row] = await loaders_1.db.query({
            sql: `SELECT t.id, t.name, t.createdAt, t.updatedAt
      FROM ?? t
      WHERE ?`,
            values: [tableName, { id }]
        });
        return row;
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function findOneSecret(id, name) {
    try {
        const options = {};
        if (id)
            options.id = id;
        if (name)
            options.name = name;
        const [row] = await loaders_1.db.query({
            sql: `SELECT * FROM ?? WHERE ?`,
            values: [tableName, options]
        });
        return row;
    }
    catch (e) {
        throw e;
    }
}
exports.findOneSecret = findOneSecret;
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
async function deleteOne(options, connection) {
    const { id } = options;
    try {
        const { affectedRows } = await loaders_1.db.query({
            connection,
            sql: `DELETE FROM ?? WHERE ? `,
            values: [tableName, { id }]
        });
        if (affectedRows > 0)
            return options;
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;
