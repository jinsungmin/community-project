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
const tableName = 'Ratings';
exports.tableName = tableName;
async function create(options, connection) {
    try {
        const { id = code_1.generateRandomCode(8), userId, postId, commentId, type } = options;
        await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                { id, userId, postId, commentId, type }
            ]
        });
        return { id, userId, postId, commentId, type };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findAll(options) {
    try {
        const { userId, postId, type, commentId } = options;
        const where = [];
        if (postId)
            where.push(`(r.postId = ${postId})`);
        if (commentId)
            where.push(`(r.commentId = ${commentId})`);
        if (type)
            where.push(`(r.type = ${type})`);
        if (userId)
            where.push(`(r.userId = ${userId})`);
        const rows = await loaders_1.db.query({
            sql: `SELECT r.* FROM ?? r
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      `,
            values: [tableName]
        });
        const [rowTotal] = await loaders_1.db.query({
            sql: `SELECT COUNT(1) as total FROM ?? r
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
        const { id, userId, postId, commentId } = options;
        const where = [];
        if (id)
            where.push(`r.id = ${id}`);
        if (userId)
            where.push(`r.userId = ${userId}`);
        if (postId)
            where.push(`(r.postId = ${postId})`);
        if (commentId)
            where.push(`(r.commentId = ${commentId})`);
        const [row] = await loaders_1.db.query({
            sql: `SELECT r.*
      FROM ?? r
      WHERE ${where.join(' AND ')}
      GROUP BY r.id`,
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
