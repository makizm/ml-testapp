"use strict";
const { Client } = require('pg');

const DbClient = /** @class */ (function() {
    function DbClient() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    }
    DbClient.prototype.query = function(text, callback) {
        this.client.connect();
        this.client.query(text, (err, result) => {
            this.client.end();
            return callback(err, result);
        })
    }
    return DbClient;
}());
exports.DbClient = DbClient;
