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
exports.deleteOne = exports.updateOne = exports.findOne = exports.findAll = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const code_1 = require("../libs/code");
const tableName = 'Categories';
exports.tableName = tableName;
async function create(options, connection) {
    try {
        const { id = code_1.generateRandomCode(8), name } = options;
        await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [tableName, { id, name }]
        });
        return { id, name };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findAll(options) {
    try {
        const { search, sort, order } = options;
        const where = [];
        if (search)
            where.push(`(c.name like '%${search}%' OR c.name like '%${search}%')`);
        const rows = await loaders_1.db.query({
            sql: `SELECT c.* FROM ?? c
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ${sort && order ? `ORDER BY c.${sort} ${order}` : ``}
      `,
            values: [tableName]
        });
        const [rowTotal] = await loaders_1.db.query({
            sql: `SELECT COUNT(1) as total FROM ?? c
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
async function findOne(options) {
    try {
        const { id } = options;
        const where = [];
        if (id)
            where.push(`c.id = ${id}`);
        const [row] = await loaders_1.db.query({
            sql: `SELECT c.*
      FROM ?? c
      WHERE ${where.join(' AND ')}
      GROUP BY c.id`,
            values: [tableName]
        });
        return row;
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
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
