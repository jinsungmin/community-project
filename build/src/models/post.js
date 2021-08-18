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
exports.deleteOne = exports.updateRating = exports.updateOne = exports.findOne = exports.findAll = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const code_1 = require("../libs/code");
const index_1 = require("./index");
const tableName = 'Posts';
exports.tableName = tableName;
const tableRating = 'Ratings';
async function create(options, connection) {
    try {
        const { id = code_1.generateRandomCode(8), categoryId, userId, title, content, createdAt = new Date(), updatedAt = new Date() } = options;
        await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                { id, categoryId, userId, title, content, createdAt, updatedAt }
            ]
        });
        return { id, categoryId, userId, title, content, ratings: 0, createdAt, updatedAt };
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findAll(options) {
    try {
        const { search, categoryId, sort, order, start, perPage } = options;
        const where = [];
        if (categoryId)
            where.push(`(p.categoryId = ${categoryId})`);
        if (search)
            where.push(`(p.title like '%${search}%' OR p.content like '%${search}%')`);
        const rows = await loaders_1.db.query({
            sql: `SELECT p.*, u.name as userName
                  FROM ?? p
                  JOIN ?? u on u.id = p.userId
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ${sort && order ? `ORDER BY p.${sort} ${order}` : ``}
      LIMIT ${start}, ${perPage}`,
            values: [tableName, index_1.User.tableName]
        });
        const [rowTotal] = await loaders_1.db.query({
            sql: `SELECT COUNT(1) as total FROM ?? p
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
            where.push(`p.id = ${id}`);
        const [row] = await loaders_1.db.query({
            sql: `SELECT p.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'userId', r.userId, 'type', r.type)) 
                  FROM ?? as r WHERE r.postId = ${id}) as ratingList
      FROM ?? p
      WHERE ${where.join(' AND ')}
      GROUP BY p.id`,
            values: [tableRating, tableName]
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
    data.updatedAt = new Date();
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
async function updateRating(id, type, connection) {
    try {
        const { affectedRows } = await loaders_1.db.query({
            connection,
            sql: `UPDATE ?? as p SET p.ratings = p.ratings + ${type ? 1 : -1}  WHERE ? `,
            values: [tableName, { id }]
        });
        if (affectedRows > 0)
            return { id };
    }
    catch (e) {
        throw e;
    }
}
exports.updateRating = updateRating;
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
