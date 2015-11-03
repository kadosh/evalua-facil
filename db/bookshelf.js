// In a file named something like bookshelf.js
var dbConfig = {
    client: 'mysql',
    debug: false,
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'pass.word1',
        database: 'evalua',
        charset: 'utf8'
    }
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);
module.exports = bookshelf;