"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateOne = exports.findOne = exports.create = exports.tableName = void 0;
const loaders_1 = require("../loaders");
const code_1 = require("../libs/code");
const tableName = 'Accounts';
exports.tableName = tableName;
async function create(options, connection) {
    try {
        const { userId, type, accountId, password } = options;
        let accountInfo = null;
        let insertType;
        if (type === 'email') {
            if (!password)
                throw new Error('password_is_required');
            insertType = type;
            const passwordHash = await code_1.createPasswordHash(password, code_1.passwordIterations.user);
            accountInfo = JSON.stringify({
                password: passwordHash.password,
                salt: passwordHash.salt
            });
        }
        else {
            insertType = `${type.charAt(0)}_${accountId}`;
            const refreshHash = code_1.generateRandomHash(64);
            accountInfo = { refreshHash };
        }
        await loaders_1.db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {
                    userId,
                    type: insertType,
                    accountId,
                    accountInfo
                }
            ]
        });
        return accountInfo;
    }
    catch (e) {
        throw e;
    }
}
exports.create = create;
async function findOne(options) {
    try {
        const { type, userId, accountId } = options;
        const where = [];
        if (userId)
            where.push(`userId = ${userId}`);
        if (type)
            where.push(`type = '${type}'`);
        if (accountId)
            where.push(`accountId = '${accountId}'`);
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
async function updateOne(options, connection) {
    const { type, userId, accountInfo } = options;
    try {
        await loaders_1.db.query({
            connection,
            sql: `UPDATE ?? SET ? WHERE ? AND ?`,
            values: [
                tableName,
                {
                    accountInfo: accountInfo ? JSON.stringify(options.accountInfo) : null
                },
                { userId },
                { type }
            ]
        });
    }
    catch (e) {
        throw e;
    }
}
exports.updateOne = updateOne;
async function updatePassword(options, connection) {
    try {
        const { password, userId } = options;
        const passwordHash = await code_1.createPasswordHash(password, code_1.passwordIterations.user);
        await loaders_1.db.query({
            connection,
            sql: `UPDATE ?? SET ? WHERE ? AND ?`,
            values: [
                tableName,
                {
                    accountInfo: JSON.stringify({
                        password: passwordHash.password,
                        salt: passwordHash.salt
                    })
                },
                { userId },
                { type: 'email' }
            ]
        });
        return passwordHash.salt;
    }
    catch (e) {
        throw e;
    }
}
exports.updatePassword = updatePassword;
